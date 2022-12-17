import { reservationManager } from '../src/plan';

// write a test for the router
const keys = {
    apiKey: process.env.TEST_APIKEY,
    authToken: process.env.TEST_AUTHTOKEN,
};

describe('testing reservation manager', () => {
    it('test reserving a slot', async () => {
        const reserved = await reservationManager.requestReservation({
            userId: 'testuser',
            venueId: '10191',
            venueMetadata: {
                name: "Joe's Seafood, Prime Steak & Stone Crab",
            },
            timeWindows: [
                {
                    startTime: new Date('2022-12-17T12:00:00.000Z'),
                    endTime: new Date('2022-12-17T20:00:00.000Z'),
                },
            ],
            partySizes: [2],
            retryIntervalSeconds: 30,
            keys,
            nextRetryTime: new Date(),
            complete: false,
            expirationTime: new Date('2027-12-17T20:00:00.000Z'),
        });

        expect(reserved).toBe(true);
    });
    it('test finding a slot', async () => {
        const slot = await reservationManager.findSuitableReservationRequest(
            '10191',
            [2, 3],
            [
                {
                    startTime: new Date('2022-12-17T12:12:12.000Z'),
                    endTime: new Date('2022-12-17T20:12:12.000Z'),
                },
                {
                    startTime: new Date('2022-12-18T15:12:12.000Z'),
                    endTime: new Date('2022-12-18T23:12:12.000Z'),
                },
            ],
            keys,
        );

        expect(slot).toBeDefined();
    });

    it('test if slot meets constraints', async () => {
        const slot = {
            id: 'testslot',
            type: 'testtype',
            startTime: new Date('2022-12-12T12:12:12.000Z'),
            endTime: new Date('2022-12-12T13:12:12.000Z'),
            size: 3,
            token: 'testtoken',
        };

        const timeWindows = [
            {
                startTime: new Date('2021-12-12T12:00:00.000Z'),
                endTime: new Date('2021-12-12T12:00:00.000Z'),
            },
            {
                startTime: new Date('2022-12-12T12:00:00.000Z'),
                endTime: new Date('2022-12-12T13:00:00.000Z'),
            },
        ];

        const partySizes = [1, 2, 3];

        const result = reservationManager.doesSlotMeetConstraints(
            slot,
            timeWindows,
            partySizes,
        );
        expect(result).toBe(true);
    });
});
