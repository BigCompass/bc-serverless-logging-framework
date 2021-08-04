"use strict";
/**
 * Destination for sending directly to an SQS queue
 */
exports.__esModule = true;
exports.sqs = void 0;
var AWS = require('aws-sdk');
var LoggingFrameworkDestinationConfigError_1 = require("../errors/LoggingFrameworkDestinationConfigError");
var decircularize_1 = require("../util/decircularize");
var sqs = function (config) {
    if (!config) {
        throw new LoggingFrameworkDestinationConfigError_1.LoggingFrameworkDestinationConfigError('No SQS Destination config supplied');
    }
    var sqsOptions = config.sqsOptions, queueUrl = config.queueUrl;
    // Set url, throw error if not provided
    if (!queueUrl) {
        throw new LoggingFrameworkDestinationConfigError_1.LoggingFrameworkDestinationConfigError('SQS Queue URL is required.');
    }
    // Setup default sqs options
    sqsOptions = sqsOptions || {};
    if (!sqsOptions.apiVersion) {
        sqsOptions.apiVersion = '2012-11-05';
    }
    if (!sqsOptions.region) {
        sqsOptions.region = 'us-east-1';
    }
    var sqs = new AWS.SQS(sqsOptions);
    return {
        send: function (log) {
            return sqs
                .sendMessage({
                MessageBody: JSON.stringify(decircularize_1.decircularize(log)),
                QueueUrl: queueUrl
            })
                .promise()["catch"](function (error) {
                console.error('Error occurred sending log message to SQS.', {
                    log: log,
                    error: error
                });
            });
        }
    };
};
exports.sqs = sqs;
