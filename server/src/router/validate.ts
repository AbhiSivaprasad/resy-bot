import { Err, Ok } from 'ts-results';

export function validateGetUser(req) {
    return validateRequestForRequiredParams(req, ['user_id']);
}

export function validatePostUser(req) {
    return validateRequestForRequiredParams(req, [
        'user_id',
        'concurrentLimit',
    ]);
}

export function validatePutUser(req) {
    return validateRequestForRequiredParams(req, [
        'user_id',
        'api_key',
        'auth_token',
    ]);
}

export function validateDeleteUser(req) {
    return validateRequestForRequiredParams(req, ['user_id']);
}

export function validateGetSearchEndpoint(req) {
    return validateRequestForRequiredParams(req, [
        'party_size',
        'api_key',
        'auth_token',
        'query',
    ]);
}

export function validateGetReservationRequests(req) {
    return validateRequestForRequiredParams(req, ['user_id']);
}

export function validateDeleteReservationRequest(req) {
    return validateRequestForRequiredParams(req, ['reservation_id']);
}

export function validateRequestReservationEndpoint(req) {
    const valid = validateRequestForRequiredParams(req, [
        'venue_id',
        'user_id',
        'slots',
        'retryIntervalSeconds',
    ]);

    if (valid.err) {
        return valid;
    }

    const { slots, retry_interval_seconds } = req.body;
    if (slots.length === 0) {
        return Err('No slots provided');
    } else if (
        !Number.isFinite(retry_interval_seconds) ||
        !Number.isInteger(retry_interval_seconds) ||
        retry_interval_seconds < 1
    ) {
        return Err('Retry interval must be an integer > 1');
    }

    if (
        slots.some((slot) => {
            !slot.partySize || !slot.startTime || !slot.endTime;
        })
    ) {
        return Err('At least one slot missing required parameters');
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
