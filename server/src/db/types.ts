import { ObjectID } from 'bson';

export type User = {
    _id: ObjectID;
    user_id: string;
    api_key: string;
    auth_token: string;
};
