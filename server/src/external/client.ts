import {
    bookSlot,
    getSlotDetails,
    getVenueDetails,
    ResyKeys,
    search,
} from './api';
import { logger } from '../app';
import { BookResponse, GeoLocation, Slot, SlotBookingInfo } from './types';

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

export const reserveSlot = async (
    slot: Slot,
    keys: ResyKeys,
): Promise<BookResponse> => {
    const bookingInfo = await getSlotBookingInfo(slot, keys);
    const response = await bookSlot(bookingInfo.bookToken, keys);
    if (response.reservation_id) {
        return {
            success: true,
        };
    } else if (response.specs) {
        // this means we are trying to book a slot we've already booked
        logger.log('Already booked slot, but trying to book again.');
        return {
            success: true,
        };
    } else {
        // failed to book slot
        return {
            success: false,
        };
    }
};

const getSlotBookingInfo = async (
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
    location?: GeoLocation,
) => await search(partySize, keys, location);
