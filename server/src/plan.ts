import { UserModel } from './db/models/user/user.model';
import { IReservationRequest, ITimeWindow } from './db/models/user/user.types';
import { ResyKeys } from './external/api';
import { getSlots, reserveSlot } from './external/client';
import { Slot } from './external/types';
import { logger } from './logger';
import { prettyprint } from './util';

export interface ActiveReservationRequest extends IReservationRequest {
    keys: ResyKeys;
    nextRetryTime: Date;
    userId: string;
}

export class ReservationRequestManager {
    private requests: ActiveReservationRequest[];
    constructor(requests?: ActiveReservationRequest[]) {
        this.requests = requests || [];
    }

    public addReservationRequest(request: ActiveReservationRequest) {
        this.requests.push(request);
    }

    public removeReservationRequest(requestId) {
        this.requests = this.requests.filter(
            (request) => request._id == requestId,
        );
    }

    public getActiveReservationRequests() {
        return this.requests.filter(this.activeReservationRequestStillValid);
    }

    public async requestReservations() {
        // iterate in reverse to enable safe deletion of finished requests
        for (let i = this.requests.length - 1; i >= 0; i--) {
            const request = this.requests[i];
            if (this.activeReservationRequestStillValid(request)) {
                // only try to reserve if it's been sufficiently long since the last attempt
                if (request.nextRetryTime.valueOf() <= new Date().valueOf()) {
                    const {
                        shouldRemoveRequest,
                        bookedVenueId,
                        bookedTimeWindow,
                    } = await this.requestReservation(request);

                    if (shouldRemoveRequest) {
                        // remove request from queue
                        logger.log(
                            `successful reservation for ${prettyprint(
                                request,
                            )}`,
                        );
                        this.requests.splice(i, 1);
                    }

                    if (bookedVenueId && bookedTimeWindow) {
                        // booking was successful, mark the request as complete
                        await this.markReservationRequestComplete(
                            request,
                            bookedVenueId,
                            bookedTimeWindow,
                        );
                    } else {
                        // if the reservation was not successful, schedule a retry
                        request.nextRetryTime = new Date();
                        request.nextRetryTime.setSeconds(
                            request.nextRetryTime.getSeconds() +
                                request.retryIntervalSeconds,
                        );
                    }
                }
            } else {
                // remove request if reservation was unsuccessful but expiration time has passed
                logger.log('expiration time passed, removing');
                this.requests.splice(i, 1);
            }
        }
    }

    public async requestReservation(request: ActiveReservationRequest) {
        let slotToReserve = null;
        for (const venue of request.venues) {
            slotToReserve = await this.findSuitableReservationRequest(
                venue.id,
                request.partySizes,
                request.timeWindows,
                request.keys,
            );

            if (slotToReserve) {
                break;
            }
        }

        if (slotToReserve) {
            const reservationResponse = await reserveSlot(
                slotToReserve,
                request.keys,
            );

            // remove the reservation request if it was successful or we have somehow already booked it
            let shouldRemoveRequest = null;
            if (reservationResponse.err) {
                switch (reservationResponse.val) {
                    case 'SLOT_ALREADY_BOOKED':
                        shouldRemoveRequest = true;
                        logger.log(
                            `Rebooking booked slot. Request: ${prettyprint(
                                request,
                            )}\n\nSlot to reserve ${prettyprint(
                                slotToReserve,
                            )}`,
                        );
                    case 'FAILED_TO_BOOK_SLOT':
                        shouldRemoveRequest = false;
                        logger.log(
                            `Snipe failed. Request: ${prettyprint(
                                request,
                            )}\n\nSlot to reserve: ${prettyprint(
                                slotToReserve,
                            )}`,
                        );
                }

                return {
                    shouldRemoveRequest,
                    bookedVenueId: null,
                    bookedTimeWindow: null,
                };
            } else {
                shouldRemoveRequest = true;
                logger.log(
                    `Snipe successful. Request: ${prettyprint(
                        request,
                    )}\n\nSlot to reserve: ${prettyprint(slotToReserve)}`,
                );
                return {
                    shouldRemoveRequest,
                    bookedVenueId: slotToReserve.id,
                    bookedTimeWindow: {
                        startTime: slotToReserve.startTime,
                        endTime: slotToReserve.endTime,
                    },
                };
            }
        }

        return {
            shouldRemoveRequest: false,
            bookedVenueId: null,
            bookedTimeWindow: null,
        };
    }

    private activeReservationRequestStillValid(
        request: ActiveReservationRequest,
    ) {
        return request.expirationTime.valueOf() >= new Date().valueOf();
    }

    public findSuitableReservationRequest = async (
        venueId: string,
        partySizes: number[],
        timeWindows: ITimeWindow[],
        keys: ResyKeys,
    ): Promise<Slot | undefined> => {
        // find all unique dates we need to check for available reservations
        // remove dates in the past (we may have been trying to snipe for multiple days)
        const allowedDates = [
            ...new Set(
                timeWindows.map((window) =>
                    window.startTime.toISOString().substring(0, 10),
                ),
            ),
        ].map((date) => new Date(date));

        // return the first slot that meets the constraints to minimize api calls
        let slotToReserve = undefined;
        for (const partySize of partySizes) {
            for (const date of allowedDates) {
                const slots = await getSlots(venueId, date, partySize, keys);
                const suitableSlots = slots.filter((slot) =>
                    this.doesSlotMeetConstraints(slot, timeWindows, partySizes),
                );
                if (suitableSlots.length > 0) {
                    slotToReserve = suitableSlots[0];
                    break;
                }
            }
        }

        return slotToReserve;
    };

    public doesSlotMeetConstraints = (
        slot: Slot,
        timeWindows: ITimeWindow[],
        partySizes: number[],
    ): boolean => {
        const slotIsInWindow = timeWindows.some(
            (window) =>
                slot.startTime >= window.startTime &&
                slot.startTime <= window.endTime,
        );
        const slotIsRightSize = partySizes.includes(slot.size);
        return slotIsInWindow && slotIsRightSize;
    };

    public async markReservationRequestComplete(
        request: ActiveReservationRequest,
        bookedVenueId: string,
        bookedTimeWindow: ITimeWindow,
    ) {
        await UserModel.updateOne(
            {
                username: request.userId,
                'reservationRequests._id': request._id,
            },
            {
                $set: {
                    'reservationRequests.$.bookedSlot': {
                        venueId: bookedVenueId,
                        timeWindow: {
                            startTime: bookedTimeWindow.startTime,
                            endTime: bookedTimeWindow.endTime,
                        },
                    },
                },
            },
        );
    }
}

// data structure to manage reservation requests
export const reservationManager = new ReservationRequestManager();
