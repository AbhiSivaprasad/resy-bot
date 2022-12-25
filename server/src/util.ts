export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${val}`);
    }
}

export const prettyprint = (obj: any) => JSON.stringify(obj, null, 2);
