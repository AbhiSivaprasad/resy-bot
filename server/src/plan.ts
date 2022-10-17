import { ResyKeys } from './api';
import { getSlots, Slot } from './client';

export const findSuitableReservation = async (
    venueId: string,
    constraints: SlotConstraints,
    keys: ResyKeys,
): Promise<Slot | undefined> => {
    // find all unique dates we need to check for available reservations
    // remove dates in the past (we may have been trying to snipe for multiple days)
    const allowedDates = [
        ...new Set(
            constraints.windows.map((window) =>
                window.startTime.toISOString().substring(0, 10),
            ),
        ),
    ].map((date) => new Date(date));

    // return the first slot that meets the constraints to minimize api calls
    let slotToReserve = undefined;
    for (const date of allowedDates) {
        const slots = await getSlots(
            venueId,
            date,
            constraints.partySize,
            keys,
        );
        const suitableSlots = slots.filter((slot) =>
            doesSlotMeetConstraints(slot, constraints),
        );
        if (suitableSlots.length > 0) {
            slotToReserve = suitableSlots[0];
            break;
        }
    }

    return slotToReserve;
};

const doesSlotMeetConstraints = (
    slot: Slot,
    constraints: SlotConstraints,
): boolean => {
    const slotIsInWindow = constraints.windows.some(
        (window) =>
            slot.startTime >= window.startTime &&
            slot.startTime <= window.endTime,
    );
    const slotIsRightSize = slot.size == constraints.partySize;
    return slotIsInWindow && slotIsRightSize;
};

type SlotConstraints = {
    windows: TimeWindow[];
    partySize: number;
};

type TimeWindow = {
    startTime: Date;
    endTime: Date;
};
