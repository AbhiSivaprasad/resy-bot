import { ObjectID } from 'bson';
import { ResyKeys } from '../external/api';

export type User = {
    _id?: ObjectID;
    user_id: string;
    keys: ResyKeys;
    concurrentLimit: number;
};

export type Reservation = {
    _id?: ObjectID;
    userId: string;
    venueId: string;
    constraints: SlotConstraints;
    expirationTime: Date;
    retryIntervalSeconds: number;
    nextRetryTime: Date;
    complete: boolean;
};

export type ReservationRequest = Reservation & {
    keys: ResyKeys;
};

export type SlotConstraints = {
    windows: TimeWindow[];
    partySize: number;
};

export type TimeWindow = {
    startTime: Date;
    endTime: Date;
};
