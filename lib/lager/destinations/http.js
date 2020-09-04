"use strict";
/**
 * Destination for sending directly to an SQS queue
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const AWS = require('aws-sdk');
const DestinationConfigError_1 = require("../errors/DestinationConfigError");
const axios_1 = require("axios");
exports.http = (config, options) => {
    if (!config) {
        throw new DestinationConfigError_1.DestinationConfigError('Axios configuration is required for http destination');
    }
    return {
        send(log) {
            config.data = log;
            return axios_1.default(config).catch(error => {
                console.error(`Error occurred sending log message to endpoint: ${config.url}`, { log, error });
            });
        }
    };
};
