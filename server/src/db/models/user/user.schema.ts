import { Schema } from 'mongoose';
const UserSchema = new Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    keys: {
        apiKey: String,
        authToken: String,
    },
    concurrentLimit: {
        type: Number,
        required: true,
    },
    reservationRequests: [
        {
            venueId: String,
            constraints: {
                windows: [
                    {
                        startTime: Date,
                        endTime: Date,
                    },
                ],
                partySize: Number,
            },
            expirationTime: Date,
            retryIntervalSeconds: Number,
            nextRetryTime: Date,
            complete: Boolean,
        },
    ],
});
export default UserSchema;
