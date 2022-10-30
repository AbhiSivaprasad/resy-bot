import { ObjectID } from 'bson';
import { Ok, Err, Result } from 'ts-results';
import { usersCollection } from './manager';
import { User } from './types';

type UpdateUserErrors = 'USER_NOT_FOUND';
type GetUserErrors = 'USER_NOT_FOUND';

export const updateUser = async (
    user_id: string,
    api_key: string,
    auth_token: string,
): Promise<Result<ObjectID, UpdateUserErrors>> => {
    const user = await (await usersCollection()).findOne({ user_id: user_id });

    if (!user) {
        return Err('USER_NOT_FOUND');
    }

    await (
        await usersCollection()
    ).updateOne(
        { _id: user._id },
        {
            $set: {
                api_key: api_key,
                auth_token: auth_token,
            },
        },
    );

    return Ok(user._id);
};

export const getUser = async (
    user_id: string,
): Promise<Result<User, GetUserErrors>> => {
    const user = <User>(
        await (await usersCollection()).findOne({ user_id: user_id })
    );

    if (!user) {
        return Err('USER_NOT_FOUND');
    }

    return Ok(user);
};
