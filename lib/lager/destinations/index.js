"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinations = void 0;
const sqs_1 = require("./sqs");
const consoleLog_1 = require("./consoleLog");
exports.destinations = {
    sqs: sqs_1.sqs,
    consoleLog: consoleLog_1.consoleLog
};
