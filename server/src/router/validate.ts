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

export function validatePostSearchEndpoint(req) {
    return validateRequestForRequiredParams(req.body, [
        'user_id',
        'partySize',
        'query',
    ]);
}

export function validateGetReservationRequests(req) {
    return validateRequestForRequiredParams(req.query, ['user_id']);
}

export function validateDeleteReservationRequest(req) {
    return validateRequestForRequiredParams(req.body, ['reservation_id']);
}

export function validatePostReservationRequestEndpoint(req) {
    const valid = validateRequestForRequiredParams(req.body, [
        'venues',
        'user_id',
        'partySizes',
        'timeWindows',
        'retryIntervalSeconds',
    ]);

    if (valid.err) {
        return valid;
    }

    const { venues, partySizes, timeWindows, retryIntervalSeconds } = req.body;
    if (partySizes.length === 0) {
        return Err('No party sizes provided');
    } else if (venues.length === 0) {
        return Err('No venues provided');
    } else if (timeWindows.length === 0) {
        return Err('No time windows provided');
    } else if (venues.some((venue) => !venue.id)) {
        return Err('At least one venue missing venueId');
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

function validateRequestForRequiredParamsAndTypes(
    requestObject,
    requestTemplate,
) {
    if (requestTemplate === 'string' || requestTemplate === 'number') {
        return typeof requestObject !== requestTemplate
            ? Err(`WRONG_TYPE`)
            : Ok(null);
    } else if (requestTemplate === 'date') {
        return typeof requestObject !== 'string' ||
            isNaN(Date.parse(requestObject))
            ? Err(`WRONG_TYPE`)
            : Ok(null);
    } else if (Array.isArray(requestTemplate)) {
        let error = null;
        for (const item of requestObject) {
            const response = validateRequestForRequiredParamsAndTypes(
                item,
                requestTemplate[0],
            );
            if (response.err) {
                error = response;
                break;
            }
        }
        return error ? error : Ok(null);
    } else if (typeof requestTemplate == 'object') {
        let error = null;
        for (const [rawParamName, paramType] of Object.entries(
            requestTemplate,
        )) {
            const required = rawParamName[-1] !== '?';
            const paramName = required
                ? rawParamName
                : rawParamName.slice(0, -1);

            if (required && !requestObject.hasOwnProperty(paramName)) {
                error = Err(`${paramName} is required`);
            } else if (required || requestObject.hasOwnProperty(paramName)) {
                const response = validateRequestForRequiredParamsAndTypes(
                    requestObject[paramName],
                    paramType,
                );
                if (response.err) {
                    switch (response.val) {
                        case 'WRONG_TYPE':
                            error = Err(`${paramName} has wrong type`);
                            break;
                        case 'UNKNOWN_TYPE':
                            error = Err(`${paramName} has unknown type`);
                            break;
                        default:
                            error = Err('Unexpected error');
                            break;
                    }
                    break;
                }
            }
        }

        return error ? error : Ok(null);
    } else {
        return Err(`UNKNOWN_TYPE`);
    }
}
