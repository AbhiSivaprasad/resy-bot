import {getVenueDetails, ResyKeys} from "./api";

// get available slots for a venue
export const getSlots = async (venueId: string, date: Date, partySize: number, keys: ResyKeys): Promise<Slot[]> => {
    const response = await getVenueDetails(venueId, date, partySize, keys);
    const slots = response?.results?.venues[0]?.slots;
    if (slots) {
        console.log(slots);
    } else {
        throw new Error("Slots not found in API response");
    }

    const processedSlots = slots.map((slot: any): Slot => {
        return ({
            id: slot.config.id,
            type: slot.config.type,
            startTime: slot.date.start,
            endTime: slot.date.end,
            minSize: slot.size.min,
            maxSize: slot.size.max,
            token: slot.config.token
        });
    });

    return slots;
};

type Slot = {
    id: string;
    type: string;
    startTime: Date;
    endTime: Date;
    minSize: number;
    maxSize: number;
    token: string;
}
