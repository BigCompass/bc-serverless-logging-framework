"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = void 0;
const ConsoleLevels_1 = require("../enums/ConsoleLevels");
const Levels_1 = require("../enums/Levels");
const decircularize_1 = require("../util/decircularize");
exports.consoleLog = (config) => ({
    send(log) {
        if (!log) {
            return;
        }
        // Retrieve the log function
        let logFn;
        let level = '';
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
});
