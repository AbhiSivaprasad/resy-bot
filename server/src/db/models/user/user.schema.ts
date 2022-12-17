import { Schema } from 'mongoose';

const ReservationRequestSchema = new Schema({
    venueId: {
        type: String,
        required: true,
    },
    timeWindows: [
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
    partySizes: {
        type: [Number],
        required: true,
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
    venueMetadata: {
        type: Object,
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
