export type Slot = {
    id: string;
    type: string;
    startTime: Date;
    endTime: Date;
    size: number;
    token: string;
};

export type SlotBookingInfo = {
    bookToken: string;
};

export type BookResponse = {
    success: boolean;
};

export type GeoLocation = {
    latitude: string;
    longitude: string;
};
