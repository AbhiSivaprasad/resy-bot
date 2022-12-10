import { reserveSlot } from '../../src/external/client';
import { Slot } from '../../src/external/types';

const keys = {
    apiKey: process.env.TEST_APIKEY,
    authToken: process.env.TEST_AUTHTOKEN,
};

describe('Integration test for Resy API client, Mutating calls', () => {
    test('Test reserving a slot', async () => {
        const slot: Slot = {
            token: 'rgs://resy/53268/1631436/3/2022-12-08/2022-12-08/14:00:00/2/Curbside',
            // date object for year, month, day
            startTime: new Date(2022, 12, 18),
            size: 2,
        } as Slot;
        const result = await reserveSlot(slot, keys);
        expect(result.err).toBe(true);
    });
});
