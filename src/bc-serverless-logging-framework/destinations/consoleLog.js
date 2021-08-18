"use strict";
exports.__esModule = true;
exports.consoleLog = void 0;
var ConsoleLevels_1 = require("../enums/ConsoleLevels");
var Levels_1 = require("../enums/Levels");
var decircularize_1 = require("../util/decircularize");
var consoleLog = function (config) { return ({
    send: function (log) {
        if (!log) {
            return;
        }
        // Retrieve the log function
        var logFn;
        var level = '';
        if (log.consoleLevel || (config === null || config === void 0 ? void 0 : config.consoleLevel)) {
            level = log.consoleLevel || (config === null || config === void 0 ? void 0 : config.consoleLevel);
        }
        else if (log.level) {
            level = log.level;
        }
        switch (level) {
            case Levels_1.Levels.debug:
            case ConsoleLevels_1.ConsoleLevels.debug:
                logFn = console.debug;
                break;
            case Levels_1.Levels.info:
            case ConsoleLevels_1.ConsoleLevels.info:
                logFn = console.info;
                break;
            case Levels_1.Levels.warn:
            case ConsoleLevels_1.ConsoleLevels.warn:
                logFn = console.warn;
                break;
            case Levels_1.Levels.error:
            case Levels_1.Levels.critical:
            case ConsoleLevels_1.ConsoleLevels.error:
                logFn = console.error;
                break;
            default:
                logFn = console.log;
        }
        // Log to the console
        logFn(JSON.stringify(decircularize_1.decircularize(log)));
    }
}); };
exports.consoleLog = consoleLog;
