"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationConfigError = void 0;
/**
 * Error to throw when there is a problem
 * configuration a destination
 */
class DestinationConfigError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.DestinationConfigError = DestinationConfigError;
