import axios from 'axios';

export const getVenueDetails = async (venueId: string, date: Date, partySize: number) => {
    const config = {
        method: 'get',
        url: "/find",
        baseURL: 'https://api.resy.com/4/',
        params: {
            lat: "0", // latitude and longitude seem unnecessary
            long: "0",
            day: date.toISOString().substring(0, 10),
            party_size: partySize.toString(),
            venue_id: venueId
        },
        headers: { 
            'accept': 'application/json, text/plain, */*', 
            'authorization': 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"'
        }
    };
    const response = await axios(config);
    return JSON.stringify(response.data);
};