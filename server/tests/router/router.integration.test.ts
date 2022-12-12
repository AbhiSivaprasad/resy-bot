import nock from 'nock';
import { RESY_API_URL } from '../../src/external/api';
import { app } from '../../src/app';
import supertest from 'supertest';
import { connect, disconnect } from '../../src/db/manager';

// write a test for the router
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
});
