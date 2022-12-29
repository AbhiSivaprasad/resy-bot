import * as Sentry from '@sentry/node';

export class Logger {
    init = async () => {
        if (process.env.NODE_ENV === 'development') {
            return;
        }

        // initialize logger
        Sentry.init({
            dsn: 'https://8bb956777dc444829c2092880694b0c8@o4504414611701760.ingest.sentry.io/4504414620221440',

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
    };

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
        if (process.env.NODE_ENV !== 'development') {
            Sentry.captureException(e);
        }
    }
}

export const logger = new Logger();
