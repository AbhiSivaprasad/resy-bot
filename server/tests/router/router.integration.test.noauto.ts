import supertest from 'supertest';
import { app } from '../../src/app';
import { reservationManager } from '../../src/plan';

const keys = {
    apiKey: process.env.TEST_APIKEY,
    authToken: process.env.TEST_AUTHTOKEN,
};

describe('non-automating testing router', () => {
    const agent = supertest.agent(app);
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
            venues: [
                {
                    id: '10191',
                    metadata: {
                        name: "Joe's Seafood, Prime Steak & Stone Crab",
                    },
                },
            ],
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
