import { Err, Ok } from 'ts-results';

export function validateGetUser(req) {
    return validateRequestForRequiredParamsAndTypes(req.query, {
        user_id: 'string',
    });
}

export function validatePostUser(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        user_id: 'string',
        concurrentLimit: 'number',
    });
}

export function validatePutUser(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        user_id: 'string',
        api_key: 'string',
        auth_token: 'string',
    });
}

export function validateDeleteUser(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        user_id: 'string',
    });
}

export function validatePostSearchEndpoint(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        user_id: 'string',
        partySize: 'number',
        query: 'any',
    });
}

export function validatePostValidateKeysEndpoint(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        api_key: 'string',
        auth_token: 'string',
    });
}

export function validateGetReservationRequests(req) {
    return validateRequestForRequiredParamsAndTypes(req.query, {
        user_id: 'string',
    });
}

export function validateDeleteReservationRequest(req) {
    return validateRequestForRequiredParamsAndTypes(req.body, {
        reservation_id: 'string',
    });
}

export function validatePostReservationRequestEndpoint(req) {
    const valid = validateRequestForRequiredParamsAndTypes(req.body, {
        venues: [{ id: 'string', 'metadata?': 'any' }],
        user_id: 'string',
        partySizes: ['number'],
        timeWindows: [{ startTime: 'date', endTime: 'date' }],
        retryIntervalSeconds: 'number',
    });

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
    } else if (retryIntervalSeconds < 1) {
        return Err('Retry interval must be an integer > 1');
    }

    return Ok(null);
}

/**
 * Validates that the request object has all the required params and that they are the correct type
 * @param requestObject
 * @param requestTemplate
 * @returns
 */
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
    } else if (requestTemplate === 'any') {
        return Ok(null);
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
