"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingFrameworkDestinationConfigError = void 0;
/**
 * Error to throw when there is a problem
 * configuration a destination
 */
class LoggingFrameworkDestinationConfigError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.LoggingFrameworkDestinationConfigError = LoggingFrameworkDestinationConfigError;
