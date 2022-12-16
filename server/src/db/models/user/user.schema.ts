import mongoose, { Schema } from 'mongoose';

const ReservationRequestSchema = new Schema({
    venueId: {
        type: String,
        required: true,
    },
    constraints: {
        windows: [
            {
                startTime: {
                    type: Date,
                    required: true,
                },
                endTime: {
                    type: Date,
                    required: true,
                },
            },
        ],
        partySize: {
            type: Number,
            required: true,
        },
    },
    expirationTime: {
        type: Date,
        required: true,
    },
    retryIntervalSeconds: {
        type: Number,
        required: true,
    },
    complete: {
        type: Boolean,
        required: true,
    },
});

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
    reservationRequests: [ReservationRequestSchema],
});

export default UserSchema;
