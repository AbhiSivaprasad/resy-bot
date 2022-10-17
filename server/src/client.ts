import moment from 'moment';
import { bookSlot, getSlotDetails, getVenueDetails, ResyKeys } from './api';

// get available slots for a venue
export const getSlots = async (
    venueId: string,
    date: Date,
    partySize: number,
    keys: ResyKeys,
): Promise<Slot[]> => {
    const response = await getVenueDetails(venueId, date, partySize, keys);
    const slots = response?.results?.venues[0]?.slots;
    if (slots) {
        console.log(slots);
    } else {
        throw new Error('Slots not found in API response');
    }

    const processedSlots = slots.map(
        (slot): Slot => ({
            id: slot.config.id,
            type: slot.config.type,
            startTime: slot.date.start.toDate(),
            endTime: slot.date.end.toDate(),
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
    } else {
        throw new Error('Reservation ID not found in API response');
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

export type Slot = {
    id: string;
    type: string;
    startTime: Date;
    endTime: Date;
    size: number;
    token: string;
};

type SlotBookingInfo = {
    bookToken: string;
};

type BookResponse = {
    success: boolean;
};
