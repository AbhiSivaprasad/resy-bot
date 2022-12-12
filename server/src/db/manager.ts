import mongoose from 'mongoose';

export const connect = async () => {
    mongoose.set('strictQuery', true);

    const uri = process.env.DB_CONN_STRING;

    await mongoose.connect(uri);

    // listen to connection for errors and log them
    mongoose.connection.on('error', (err) => {
        console.log(err);
    });
};

export const disconnect = async () => {
    mongoose.connection.close();
};
