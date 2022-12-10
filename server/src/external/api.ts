import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { GeoLocation } from './types';

export const RESY_API_URL = 'https://api.resy.com/';

export const getVenueDetails = async (
    venueId: string,
    date: Date,
    partySize: number,
    keys: ResyKeys,
) => {
    const config = {
        method: 'get',
        url: '/4/find',
        baseURL: RESY_API_URL,
        params: {
            lat: '0', // latitude and longitude seem unnecessary
            long: '0',
            day: date.toISOString().substring(0, 10),
            party_size: partySize.toString(),
            venue_id: venueId,
        },
        headers: buildHeaders(
            {
                accept: 'application/json, text/plain, */*',
            },
            keys,
            false,
        ),
    };
    const response: AxiosResponse = await axios(config);
    return response.data;
};

export const getSlotDetails = async (
    slotTokenId: string,
    date: Date,
    partySize: number,
    keys: ResyKeys,
) => {
    const data = JSON.stringify({
        commit: 1, // a 0 here will not return a booking token
        config_id: slotTokenId,
        day: date.toISOString().substring(0, 10),
        party_size: partySize,
    });

    const config = {
        method: 'post',
        url: '/3/details',
        baseURL: RESY_API_URL,
        headers: buildHeaders(
            {
                'content-type': 'application/json',
            },
            keys,
            false,
        ),
        data: data,
    };

    const response = await axios(config);
    return response.data;
};

export const bookSlot = async (bookToken: string, keys: ResyKeys) => {
    const data = qs.stringify({
        book_token: bookToken,
        source_id: 'resy.com-venue-details',
    });
    const config = {
        method: 'post',
        url: '/3/book',
        baseURL: RESY_API_URL,
        headers: buildHeaders(
            {
                'content-type': 'application/x-www-form-urlencoded',
            },
            keys,
        ),
        data: data,
    };

    // the server returns 412 but the request is successful so use the error response
    const response = await axios(config).catch((error) => error.response);
    return response.data;
};

export const search = async (
    partySize: number,
    keys: ResyKeys,
    query: string,
    location?: GeoLocation,
) => {
    const data = JSON.stringify({
        ...(location && {
            geo: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        }),
        per_page: 5,
        query: query,
        slot_filter: {
            day: new Date().toISOString().substring(0, 10),
            party_size: partySize,
        },
        types: ['venue', 'cuisine'],
    });

    const config = {
        method: 'post',
        url: '/3/venuesearch/search',
        baseURL: RESY_API_URL,
        headers: {
            'content-type': 'application/json',
            authorization: `ResyAPI api_key="${keys.apiKey}"`,
        },
        data: data,
    };

    const response = await axios(config);
    return response.data;
};

const buildHeaders = (headers, keys: ResyKeys, authtoken = true) => ({
    ...headers,
    ...{
        authorization: `ResyAPI api_key="${keys.apiKey}"`,
    },
    ...(authtoken && { 'x-resy-universal-auth': keys.authToken }),
});

export type ResyKeys = {
    apiKey: string;
    authToken: string;
};
