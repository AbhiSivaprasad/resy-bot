import {
    bookSlot,
    getSlotDetails,
    getVenueDetails,
    ResyKeys,
    search,
} from './api';
import { logger } from '../logger';
import { GeoLocation, Slot, SlotBookingInfo } from './types';
import { Err, Ok, Result } from 'ts-results';

// get available slots for a venue
export const getSlots = async (
    venueId: string,
    date: Date,
    partySize: number,
    keys: ResyKeys,
): Promise<Ok<Slot[]> | Err<any>> => {
    const response = await getVenueDetails(venueId, date, partySize, keys);
    if (response.err) {
        return response;
    }
    let slots = response.val?.results?.venues[0]?.slots;
    if (!slots) {
        logger.log('Slots not found in API response');
        slots = [];
    }

    const processedSlots = slots.map(
        (slot): Slot => ({
            id: slot.config.id,
            type: slot.config.type,
            startTime: new Date(slot.date.start),
            endTime: new Date(slot.date.end),
            size: Number(slot.size.max), // there is also a slot.size.min, unclear what this means
            token: slot.config.token,
        }),
    );

    return processedSlots;
};

export const reserveSlot = async (
    slot: Slot,
    keys: ResyKeys,
): Promise<Result<void, any>> => {
    // get the booking token for the slot, it's required to reserve the slot
    const bookingInfo = await getSlotBookingInfo(slot, keys);
    if (bookingInfo.err) {
        return bookingInfo;
    }

    // actually snipe the reservation
    const response = await bookSlot(bookingInfo.val.bookToken, keys);
    if (response.err) {
        return response;
    }

    if (response.val.reservation_id) {
        return Ok(undefined);
    } else if (response.val.specs) {
        // we are trying to book a slot we've already booked
        return Err('SLOT_ALREADY_BOOKED');
    } else {
        // failed to book slot
        return Err('FAILED_TO_BOOK_SLOT');
    }
};

export const getSlotBookingInfo = async (
    slot: Slot,
    keys: ResyKeys,
): Promise<Result<SlotBookingInfo, any>> => {
    const response = await getSlotDetails(
        slot.token,
        slot.startTime,
        slot.size,
        keys,
    );
    if (response.err) {
        return response;
    }
    const bookToken = response.val?.book_token?.value;
    if (bookToken) {
        return Ok({
            bookToken,
        });
    } else {
        return Err('UNEXPECTED_RESY_API_RESPONSE');
    }
};

export const searchResults = async (
    partySize: number,
    keys: ResyKeys,
    query,
    location?: GeoLocation,
) => await search(partySize, keys, query, location);
