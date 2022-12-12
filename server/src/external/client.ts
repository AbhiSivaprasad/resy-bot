import {
    bookSlot,
    getSlotDetails,
    getVenueDetails,
    ResyKeys,
    search,
} from './api';
import { logger } from '../logger';
import { BookResponse, GeoLocation, Slot, SlotBookingInfo } from './types';
import { Err, Ok, Result } from 'ts-results';

// get available slots for a venue
export const getSlots = async (
    venueId: string,
    date: Date,
    partySize: number,
    keys: ResyKeys,
): Promise<Slot[]> => {
    const response = await getVenueDetails(venueId, date, partySize, keys);
    let slots = response?.results?.venues[0]?.slots;
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

type ReserveSlotErrors = 'SLOT_ALREADY_BOOKED' | 'FAILED_TO_BOOK_SLOT';

export const reserveSlot = async (
    slot: Slot,
    keys: ResyKeys,
): Promise<Result<void, ReserveSlotErrors>> => {
    const bookingInfo = await getSlotBookingInfo(slot, keys);
    const response = await bookSlot(bookingInfo.bookToken, keys);
    if (response.reservation_id) {
        return Ok(undefined);
    } else if (response.specs) {
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
): Promise<SlotBookingInfo> => {
    const response = await getSlotDetails(
        slot.token,
        slot.startTime,
        slot.size,
        keys,
    );
    const bookToken = response?.book_token?.value;
    if (bookToken) {
        return {
            bookToken,
        };
    } else {
        throw new Error('Book token not found in API response');
    }
};

export const searchResults = async (
    partySize: number,
    keys: ResyKeys,
    query,
    location?: GeoLocation,
) => await search(partySize, keys, query, location);
