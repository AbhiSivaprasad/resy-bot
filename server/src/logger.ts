export class Logger {
    log(message): void {
        console.log(message);
    }

    error(message): void {
        console.log(message);
    }
}

export const logger = new Logger();
