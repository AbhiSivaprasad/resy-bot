import { Schema } from 'mongoose';

const ReservationRequestSchema = new Schema({
    venues: [
        {
            id: {
                type: String,
                required: true,
            },
            metadata: {
                type: Object,
                required: true,
            },
        },
    ],
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
    bookedSlot: {
        type: Object,
        required: false,
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
    admin: {
        type: Boolean,
        required: false,
    },
    reservationRequests: [ReservationRequestSchema],
});

export default UserSchema;
