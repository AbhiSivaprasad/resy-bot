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
});
export default UserSchema;
