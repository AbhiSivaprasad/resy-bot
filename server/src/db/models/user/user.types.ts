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
    venues: IVenue[];
    timeWindows: ITimeWindow[];
    partySizes: number[];
    expirationTime: Date;
    retryIntervalSeconds: number;
    bookedSlot?: IBookedSlot;
}

export interface ITimeWindow {
    startTime: Date;
    endTime: Date;
}

export interface IVenue {
    id: string;
    metadata?: any;
}

export interface IBookedSlot {
    venueId: string;
    timeWindow: ITimeWindow;
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
