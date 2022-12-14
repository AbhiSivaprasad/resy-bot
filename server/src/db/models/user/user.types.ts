import { Document, Model } from 'mongoose';
import { ResyKeys } from '../../../external/api';

export interface IUser {
    username: string;
    keys: ResyKeys;
    concurrentLimit: number;
    reservationRequests: IReservationRequest[];
}

export interface IReservationRequest {
    venueId: string;
    constraints: ISlotConstraints;
    expirationTime: Date;
    retryIntervalSeconds: number;
    nextRetryTime: Date;
    complete: boolean;
}

export interface ISlotConstraints {
    windows: ITimeWindow[];
    partySize: number;
}

export interface ITimeWindow {
    startTime: Date;
    endTime: Date;
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
