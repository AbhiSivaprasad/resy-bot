import {
    deleteReservationRequest,
    deleteUser,
    getAllUsers,
    getReservationRequests,
    getSearch,
    getUser,
    postRequestReservation,
    postUser,
    putUser,
} from './handler';
import {
    validateDeleteReservationRequest,
    validateDeleteUser,
    validateGetReservationRequests,
    validateGetSearchEndpoint,
    validateGetUser,
    validatePostUser,
    validatePutUser,
    validateRequestReservationEndpoint,
} from './validate';

export async function getUserEndpoint(req, res) {
    const result = validateGetUser(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const user = await getUser(req.query.user_id);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.status(200).send(user);
    }
}

export async function postUserEndpoint(req, res) {
    const result = validatePostUser(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id, concurrentLimit } = req.body;
    const user = await postUser(user_id, concurrentLimit);
    if (!user) {
        // TODO: this is a catch all error
        res.status(404).send('User already exists');
    } else {
        res.status(200).send(user);
    }
}

export async function putUserEndpoint(req, res) {
    const result = validatePutUser(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id, api_key, auth_token } = req.body;
    const updated = await putUser(user_id, api_key, auth_token);
    if (!updated) {
        res.status(404).send('Update failed');
    } else {
        res.status(200).send('Update successful');
    }
}

export async function deleteUserEndpoint(req, res) {
    const result = validateDeleteUser(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id } = req.body;
    const deleted = await deleteUser(user_id);
    if (!deleted) {
        res.status(404).send('Update failed');
    } else {
        res.status(200).send('Update successful');
    }
}

export async function getSearchEndpoint(req, res) {
    const result = validateGetSearchEndpoint(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { party_size, latitude, longitude, api_key, auth_token, query } =
        req.body;

    const searchResults = await getSearch(
        parseInt(party_size),
        latitude,
        longitude,
        api_key,
        auth_token,
        query,
    );

    res.send(searchResults);
}

export async function getAllUsersEndpoint(req, res) {
    const userIds = await getAllUsers();
    res.status(200).send(userIds);
}

export async function getReservationRequestsEndpoint(req, res) {
    const result = validateGetReservationRequests(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id } = req.body;

    const reservationRequests = await getReservationRequests(user_id);
    res.status(200).send(reservationRequests);
}

export async function deleteReservationRequestEndpoint(req, res) {
    const result = validateDeleteReservationRequest(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id, reservation_id } = req.body;

    const deleted = deleteReservationRequest(user_id, reservation_id);
    if (!deleted) {
        res.status(404).send('Delete failed');
    } else {
        res.status(200).send('Delete successful');
    }
}

export async function postRequestReservationEndpoint(req, res) {
    const result = validateRequestReservationEndpoint(req);
    if (result.err) {
        res.status(400).send(result.val);
        return;
    }

    const { user_id, venue_id, slots, retryIntervalSeconds } = req.body;

    const success = await postRequestReservation(
        user_id,
        venue_id,
        retryIntervalSeconds,
        slots,
    );

    // return success response
    res.status(200).send('Reservation request successful');
}
