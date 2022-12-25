import { app } from '../../src/app';
import supertest from 'supertest';
import { connect, disconnect } from '../../src/db/manager';

const keys = {
    apiKey: process.env.TEST_APIKEY,
    authToken: process.env.TEST_AUTHTOKEN,
};

describe('testing router', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    const agent = supertest.agent(app);

    it('test CRUD /user', async () => {
        // create user
        let response = await agent.post('/user').send({
            user_id: 'testuser',
            concurrentLimit: 1,
        });

        const writtenUser = response.body;
        expect(writtenUser.user_id).toBe('testuser');
        expect(writtenUser.concurrentLimit).toBe(1);

        // read created user
        response = await agent.get('/user?user_id=testuser');
        let fetchedUser = response.body;
        expect(fetchedUser.user_id).toBe('testuser');
        expect(fetchedUser.concurrentLimit).toBe(1);

        // update user
        response = await agent
            .put('/user')
            .send({
                user_id: 'testuser',
                api_key: 'testapikey',
                auth_token: 'testauthtoken',
            })
            .expect(200);

        // read updated user
        response = await agent.get('/user?user_id=testuser');
        fetchedUser = response.body;
        expect(fetchedUser.keys.apiKey).toBe('testapikey');
        expect(fetchedUser.keys.authToken).toBe('testauthtoken');

        // delete user
        response = await agent
            .delete('/user')
            .send({ user_id: 'testuser' })
            .expect(200);

        // read user to see if they exist
        await agent.get('/user?user_id=testuser').expect(404);
    });

    it('test POST /search', async () => {
        // create user
        await agent.post('/user').send({
            user_id: 'testuser',
            concurrentLimit: 1,
        });

        // update user
        await agent
            .put('/user')
            .send({
                user_id: 'testuser',
                api_key: keys.apiKey,
                auth_token: keys.authToken,
            })
            .expect(200);

        await agent
            .post(`/search`)
            .send({
                user_id: 'testuser',
                partySize: 2,
                query: 'Joe',
            })
            .expect(200);

        // delete user
        await agent.delete('/user').send({ user_id: 'testuser' }).expect(200);
    });

    it('test POST /search faulty input', async () => {
        // create user
        await agent.post('/user').send({
            user_id: 'testuser',
            concurrentLimit: 1,
        });

        // update user
        await agent
            .put('/user')
            .send({
                user_id: 'testuser',
                api_key: 'bad api key',
                auth_token: 'bad auth token',
            })
            .expect(200);

        await agent
            .post(`/search`)
            .send({
                user_id: 'testuser',
                partySize: 2,
                query: 'Joe',
            })
            .expect(404);

        // delete user
        await agent.delete('/user').send({ user_id: 'testuser' }).expect(200);
    });

    it('test GET /allUsers', async () => {
        const userIds = await agent.get('/allUsers').expect(200);
        if (userIds.body.length > 0) {
            await agent.get(`/user?user_id=${userIds.body[0]}`).expect(200);
        }
    });
});
