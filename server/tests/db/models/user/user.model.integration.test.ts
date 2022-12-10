import { connect, disconnect } from '../../../../src/db/manager';
import { UserModel } from '../../../../src/db/models/user/user.model';

describe('Test User Model', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    it('should create a new user', async () => {
        const user = {
            username: 'testuser',
            keys: {
                apiKey: 'testapikey',
                authToken: 'testauthtoken',
            },
            concurrentLimit: 1,
        };

        // write user to database
        await UserModel.create(user);

        // fetch user back from database
        let dbUser = await UserModel.findOne({ username: 'testuser' });

        // check if user is equal to the one we wrote
        const { username, keys, concurrentLimit } = dbUser;
        expect(username).toEqual(user.username);
        expect(keys).toEqual(user.keys);
        expect(concurrentLimit).toEqual(user.concurrentLimit);

        // delete test user from database
        await UserModel.deleteOne({ username: 'testuser' });

        // check that user is deleted
        dbUser = await UserModel.findOne({ username: 'testuser' });
        expect(dbUser).toBeNull();
    });
});
