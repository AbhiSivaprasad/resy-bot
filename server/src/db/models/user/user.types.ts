import mongoose, { Document, Model } from 'mongoose';
import { ResyKeys } from '../../../external/api';

export interface IUser {
    username: string;
    keys: ResyKeys;
    concurrentLimit: number;
    reservationRequests: IReservationRequest[];
}

export interface IReservationRequest {
    _id?: mongoose.Types.ObjectId;
    venueId: string;
    venueMetadata: any;
    timeWindows: ITimeWindow[];
    partySizes: number[];
    expirationTime: Date;
    retryIntervalSeconds: number;
    complete: boolean;
}

export interface ITimeWindow {
    startTime: Date;
    endTime: Date;
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
