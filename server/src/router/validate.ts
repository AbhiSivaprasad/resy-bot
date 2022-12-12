import { Err, Ok } from 'ts-results';

export function validateGetUser(req) {
    return validateEndpoint(req, ['user_id']);
}

export function validatePostUser(req) {
    return validateEndpoint(req, ['user_id', 'concurrentLimit']);
}

export function validatePutUser(req) {
    return validateEndpoint(req, ['user_id', 'api_key', 'auth_token']);
}

export function validateDeleteUser(req) {
    return validateEndpoint(req, ['user_id']);
}

function validateEndpoint(req, requiredParams) {
    const missingParam = checkRequestForRequiredParams(req, requiredParams);

    if (!missingParam) {
        return Err(`${missingParam} is required`);
    }

    return Ok(null);
}

function checkRequestForRequiredParams(requestObject, requiredParams) {
    for (const param of requiredParams) {
        if (!requestObject.hasOwnProperty(param)) {
            return param;
        }
    }

    return null;
}
