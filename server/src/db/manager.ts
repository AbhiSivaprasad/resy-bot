import * as mongoDB from 'mongodb';
import { logger } from '../app';
import { USER_COLLECTION_NAME } from './constants';

export class dbManager {
    static db: Promise<mongoDB.Db>;

    static init() {
        this.db = this.connectToDatabase();
    }

    static async connectToDatabase() {
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(
            process.env.DB_CONN_STRING,
        );

        await client.connect();

        const db: mongoDB.Db = client.db(process.env.DB_NAME);

        logger.log(`Successfully connected to database: ${db.databaseName}`);

        return db;
    }
}

export async function usersCollection() {
    const db = await dbManager.db;
    return db.collection(USER_COLLECTION_NAME);
}
