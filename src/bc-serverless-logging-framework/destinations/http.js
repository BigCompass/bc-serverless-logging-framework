"use strict";
exports.__esModule = true;
exports.http = void 0;
/**
 * Destination for sending logs to an HTTP endpoint
 */
var LoggingFrameworkDestinationConfigError_1 = require("../errors/LoggingFrameworkDestinationConfigError");
var axios_1 = require("axios");
var http = function (config) {
    if (!config) {
        throw new LoggingFrameworkDestinationConfigError_1.LoggingFrameworkDestinationConfigError('Axios configuration is required for http destination');
    }
    return {
        send: function (log) {
            config.data = log;
            return axios_1["default"](config)["catch"](function (error) {
                console.error("Error occurred sending log message to endpoint: " + config.url, { log: log, error: error });
            });
        }
    };
};
exports.http = http;
