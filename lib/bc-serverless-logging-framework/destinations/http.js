"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
/**
 * Destination for sending logs to an HTTP endpoint
 */
const LoggingFrameworkDestinationConfigError_1 = require("../errors/LoggingFrameworkDestinationConfigError");
const axios_1 = __importDefault(require("axios"));
exports.http = (config) => {
    if (!config) {
        throw new LoggingFrameworkDestinationConfigError_1.LoggingFrameworkDestinationConfigError('Axios configuration is required for http destination');
    }
    return {
        send(log) {
            config.data = log;
            return axios_1.default(config).catch((error) => {
                console.error(`Error occurred sending log message to endpoint: ${config.url}`, { log, error });
            });
        }
    };
};
