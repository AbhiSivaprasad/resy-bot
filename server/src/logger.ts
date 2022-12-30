import { Sentry } from './sentry';

export class Logger {
    async log(message) {
        if (process.env.NODE_ENV === 'development') {
            console.log(message);
        } else {
            Sentry.captureMessage(message, 'debug');
        }
    }

    async error(message) {
        if (process.env.NODE_ENV === 'development') {
            console.log(message);
        } else {
            Sentry.captureMessage(message, 'error');
        }
    }

    async captureException(e) {
        if (process.env.NODE_ENV === 'development') {
            console.log(e);
        } else {
            Sentry.captureException(e);
        }
    }
}

export const logger = new Logger();
