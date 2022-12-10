import axios from 'axios';
import {
    getSlotBookingInfo,
    getSlots,
    searchResults,
} from '../../src/external/client';
import { GeoLocation, Slot } from '../../src/external/types';
import { inspect } from 'util';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.dev' });
const keys = {
    apiKey: process.env.TEST_APIKEY,
    authToken: process.env.TEST_AUTHTOKEN,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function turnOnAxiosDebugging() {
    axios.interceptors.request.use((request) => {
        console.log('Starting Request', JSON.stringify(request, null, 2));
        return request;
    });

    axios.interceptors.response.use((response) => {
        console.log('Response:', inspect(response));
        return response;
    });
}

describe('Integration test for Resy API client', () => {
    test('Test getting slots', async () => {
        const venueId = '10191';
        const date = new Date();
        const partySize = 2;
        await expect(
            getSlots(venueId, date, partySize, keys),
        ).resolves.not.toThrowError();
    });

    test('Get details of a slot booking', async () => {
        const slot = {
            token: 'rgs://resy/10191/1022685/2/2022-10-18/2022-10-18/16:00:00/2/Adirondack chairs cocktails',
            startTime: new Date(),
            size: 2,
        } as Slot;
        await expect(
            getSlotBookingInfo(slot, keys),
        ).resolves.not.toThrowError();
    });

    test('Get search results from resy api', async () => {
        const partySize = 2;
        const query = "Joe's Shanghai";
        const location: GeoLocation = {
            latitude: '40.7128',
            longitude: '-74.006',
        };
        await expect(
            searchResults(partySize, keys, query, location),
        ).resolves.not.toThrowError();
    });
});
