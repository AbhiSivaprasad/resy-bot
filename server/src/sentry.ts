import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV !== 'development') {
    // initialize logger
    Sentry.init({
        dsn: 'https://8bb956777dc444829c2092880694b0c8@o4504414611701760.ingest.sentry.io/4504414620221440',

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

export { Sentry };
