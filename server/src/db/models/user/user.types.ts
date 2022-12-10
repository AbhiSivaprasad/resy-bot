import { Document, Model } from 'mongoose';
import { ResyKeys } from '../../../external/api';
export interface IUser {
    username: string;
    keys: ResyKeys;
    concurrentLimit: number;
}
export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
