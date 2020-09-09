"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinations = void 0;
const sqs_1 = require("./sqs");
const http_1 = require("./http");
const consoleLog_1 = require("./consoleLog");
exports.destinations = {
    sqs: sqs_1.sqs,
    http: http_1.http,
    consoleLog: consoleLog_1.consoleLog
};
