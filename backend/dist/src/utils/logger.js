export class Logger {
    static info(message, meta) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
    }
    static warn(message, meta) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
    }
    static error(message, error, meta) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error?.message || error, meta ? JSON.stringify(meta) : '');
    }
}
//# sourceMappingURL=logger.js.map