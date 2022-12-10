import { Schema } from 'mongoose';
const UserSchema = new Schema({
    username: String,
    keys: {
        apiKey: String,
        authToken: String,
    },
    concurrentLimit: Number,
});
export default UserSchema;
