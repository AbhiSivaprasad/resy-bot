import { Err, Ok } from 'ts-results';

export function validateGetUser(req) {
    return validateRequestForRequiredParams(req.query, ['user_id']);
}

export function validatePostUser(req) {
    return validateRequestForRequiredParams(req.body, [
        'user_id',
        'concurrentLimit',
    ]);
}

export function validatePutUser(req) {
    return validateRequestForRequiredParams(req.body, [
        'user_id',
        'api_key',
        'auth_token',
    ]);
}

export function validateDeleteUser(req) {
    return validateRequestForRequiredParams(req.body, ['user_id']);
}

export function validateGetSearchEndpoint(req) {
    return validateRequestForRequiredParams(req.query, [
        'party_size',
        'api_key',
        'auth_token',
        'query',
    ]);
}

export function validateGetReservationRequests(req) {
    return validateRequestForRequiredParams(req.query, ['user_id']);
}

export function validateDeleteReservationRequest(req) {
    return validateRequestForRequiredParams(req.body, ['reservation_id']);
}

export function validateRequestReservationEndpoint(req) {
    const valid = validateRequestForRequiredParams(req.body, [
        'venue_id',
        'user_id',
        'partySizes',
        'timeWindows',
        'retryIntervalSeconds',
    ]);

    if (valid.err) {
        return valid;
    }

    const { partySizes, timeWindows, retryIntervalSeconds } = req.body;
    if (partySizes.length === 0) {
        return Err('No party sizes provided');
    } else if (timeWindows.length === 0) {
        return Err('No time windows provided');
    } else if (
        !Number.isFinite(retryIntervalSeconds) ||
        !Number.isInteger(retryIntervalSeconds) ||
        retryIntervalSeconds < 1
    ) {
        return Err('Retry interval must be an integer > 1');
    }

    if (
        timeWindows.some((window) => {
            !window.startTime || !window.endTime;
        })
    ) {
        return Err('At least one time slot missing required parameters');
    }

    return Ok(null);
}

function validateRequestForRequiredParams(requestObject, requiredParams) {
    for (const param of requiredParams) {
        if (!requestObject.hasOwnProperty(param)) {
            return Err(`${param} is required`);
        }
    }

    return Ok(null);
}
