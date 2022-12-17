import { log } from 'console';

export class Logger {
    log(message): void {
        log(message);
    }

    error(message): void {
        log(message);
    }
}

export const logger = new Logger();
