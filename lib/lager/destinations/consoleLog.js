"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = void 0;
const ConsoleLevels_1 = require("../enums/ConsoleLevels");
const Levels_1 = require("../enums/Levels");
exports.consoleLog = (config) => ({
    send(log) {
        let logFn;
        if (ConsoleLevels_1.ConsoleLevels[(config === null || config === void 0 ? void 0 : config.consoleLevel) || (log === null || log === void 0 ? void 0 : log.consoleLevel) || '']) {
            logFn = console[(config === null || config === void 0 ? void 0 : config.consoleLevel) || (log === null || log === void 0 ? void 0 : log.consoleLevel) || ''];
        }
        else {
            switch (log.level) {
                case Levels_1.Levels.info:
                    logFn = console.info;
                    break;
                case Levels_1.Levels.warn:
                    logFn = console.warn;
                    break;
                case Levels_1.Levels.debug:
                    logFn = console.debug;
                    break;
                case Levels_1.Levels.error:
                case Levels_1.Levels.critical:
                    logFn = console.error;
                    break;
                default:
                    logFn = console.log;
            }
        }
        logFn(log);
    }
});
