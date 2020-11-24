"use strict";
/**
 * Destination for sending directly to an SQS queue
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqs = void 0;
const AWS = require('aws-sdk');
const DestinationConfigError_1 = require("../errors/DestinationConfigError");
const decircularize_1 = require("../util/decircularize");
exports.sqs = (config) => {
    let { sqsOptions, queueUrl } = config;
    // Set url, throw error if not provided
    if (!queueUrl) {
        throw new DestinationConfigError_1.DestinationConfigError('SQS Queue URL is required.');
    }
    // Setup default sqs options
    sqsOptions = sqsOptions || {};
    if (!sqsOptions.apiVersion) {
        sqsOptions.apiVersion = '2012-11-05';
    }
    if (!sqsOptions.region) {
        sqsOptions.region = 'us-east-1';
    }
    const sqs = new AWS.SQS(sqsOptions);
    return {
        send(log) {
            return sqs
                .sendMessage({
                MessageBody: JSON.stringify(decircularize_1.decircularize(log)),
                QueueUrl: queueUrl
            })
                .promise()
                .catch((error) => {
                console.error('Error occurred sending log message to SQS.', {
                    log,
                    error
                });
            });
        }
    };
};
