import axios from 'axios';

export const getVenueDetails = async (venueId: string, date: Date, partySize: number, keys: ResyKeys) => {
    const config = {
        method: 'get',
        url: "/4/find",
        baseURL: 'https://api.resy.com/',
        params: {
            lat: "0", // latitude and longitude seem unnecessary
            long: "0",
            day: date.toISOString().substring(0, 10),
            party_size: partySize.toString(),
            venue_id: venueId
        },
        headers: buildHeaders({ 
            'accept': 'application/json, text/plain, */*', 
        }, keys)
    };
    const response = await axios(config);
    return response.data;
};

export const getSlotDetails = async (slotTokenId: string, date: Date, partySize: number, keys: ResyKeys) => {
    const data = JSON.stringify({
        "commit": 1, // a 0 here will not return a booking token
        "config_id": slotTokenId,
        "day": date.toISOString().substring(0, 10),
        "party_size": partySize
    });
      
    const config = {
        method: 'post',
        url: '/3/details',
        baseURL: 'https://api.resy.com/',
        headers: buildHeaders({ 
            'content-type': 'application/json'
        }, keys),
        data : data
    };

    const response = await axios(config);
    return response.data;
};
    
export const bookSlot = async (bookToken: string, paymentId: string, keys: ResyKeys) => {
    const data = JSON.stringify({
        'book_token': bookToken,
        'struct_payment_method': {
            "id": paymentId
        },
        'source_id': 'resy.com-venue-details' 
    });
    const config = {
        method: 'post',
        url: '/3/book',
        baseURL: 'https://api.resy.com/',
        headers: buildHeaders({ 
            'content-type': 'application/x-www-form-urlencoded', 
        }, keys),
        data : data
    };

    const response = await axios(config);
    return response.data; 
};

const buildHeaders = (headers, keys: ResyKeys) => {
    return {
        ...headers,
        ...{
            'authorization': `ResyAPI api_key="${keys.apiKey}"`,
            'x-resy-universal-auth': keys.authToken
        }
    };
};

export type ResyKeys = {
    apiKey: string;
    authToken: string;
}