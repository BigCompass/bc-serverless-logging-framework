"use strict";
exports.__esModule = true;
exports.destinations = void 0;
var sqs_1 = require("./sqs");
var http_1 = require("./http");
var consoleLog_1 = require("./consoleLog");
var file_1 = require("./file");
exports.destinations = {
    sqs: sqs_1.sqs,
    http: http_1.http,
    consoleLog: consoleLog_1.consoleLog,
    fileWriter: file_1.fileWriter
};
