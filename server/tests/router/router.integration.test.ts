import nock from 'nock';
import { RESY_API_URL } from '../../src/external/api';
import { app } from '../../src/app';
import supertest from 'supertest';
import { connect, disconnect } from '../../src/db/manager';
import { reservationManager } from '../../src/plan';

// write a test for the router
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
        await agent
            .post(`/search`)
            .send({
                party_size: 2,
                api_key: keys.apiKey,
                auth_token: keys.authToken,
                query: 'Joe',
            })
            .expect(200);
    });

    it('test GET /allUsers', async () => {
        const userIds = await agent.get('/allUsers').expect(200);
        if (userIds.body.length > 0) {
            await agent.get(`/user?user_id=${userIds.body[0]}`).expect(200);
        }
    });

    it('test CRUD /reservation', async () => {
        // create user
        await agent.post('/user').send({
            user_id: 'testuser',
            concurrentLimit: 12,
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

        // create reservation
        const response = await agent.post('/reservationRequest').send({
            user_id: 'testuser',
            venue_id: '10191',
            venueMetadata: {
                name: "Joe's Seafood, Prime Steak & Stone Crab",
            },
            timeWindows: [
                {
                    startTime: '2022-12-17T12:00:00.000Z',
                    endTime: '2022-12-17T20:00:00.000Z',
                },
                {
                    startTime: '2022-12-18T15:00:00.000Z',
                    endTime: '2022-12-18T23:00:00.000Z',
                },
            ],
            partySizes: [2],
            retryIntervalSeconds: 30,
        });

        // checked the reservation request is queued correctly
        const queuedRequests =
            reservationManager.getActiveReservationRequests();
        expect(queuedRequests.length).toBe(1);
        expect(queuedRequests[0].userId).toBe('testuser');

        // try reserving
        await reservationManager.requestReservations();
    });
});
