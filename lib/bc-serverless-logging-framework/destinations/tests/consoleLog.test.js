"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consoleLog_1 = require("../consoleLog");
const ConsoleLevels_1 = require("../../enums/ConsoleLevels");
const bc_serverless_logging_framework_1 = require("../../../bc-serverless-logging-framework");
const destinations = {
    // Will log based on log level
    normal: consoleLog_1.consoleLog(),
    // Will log based on log level
    weird: consoleLog_1.consoleLog({ consoleLevel: null }),
    // Will always send debug logs
    debug: consoleLog_1.consoleLog({ consoleLevel: ConsoleLevels_1.ConsoleLevels.debug }),
    // Will always send info logs
    info: consoleLog_1.consoleLog({ consoleLevel: ConsoleLevels_1.ConsoleLevels.info }),
    // Will always send warn logs
    warn: consoleLog_1.consoleLog({ consoleLevel: ConsoleLevels_1.ConsoleLevels.warn }),
    // Will always send error logs
    error: consoleLog_1.consoleLog({ consoleLevel: ConsoleLevels_1.ConsoleLevels.error })
};
const spies = {
    console: {
        debug: jest.spyOn(console, 'debug').mockImplementation(),
        info: jest.spyOn(console, 'info').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation(),
        log: jest.spyOn(console, 'log').mockImplementation()
    }
};
const assertCalls = (logFn) => {
    for (let key in spies.console) {
        const spy = spies.console[key];
        const callsExpected = key === logFn ? 1 : 0;
        expect(spy).toHaveBeenCalledTimes(callsExpected);
        spy.mockClear();
    }
};
it('logs as expected for each bcLogger level', () => {
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.debug,
        message: 'test message'
    });
    assertCalls('debug');
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message'
    });
    assertCalls('info');
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
        message: 'test message'
    });
    assertCalls('warn');
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.error,
        message: 'test message'
    });
    assertCalls('error');
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.critical,
        message: 'test message'
    });
    assertCalls('error');
    destinations.normal.send({
        level: 'random_log_level',
        message: 'test message'
    });
    assertCalls('log');
});
it('logs correctly using consoleLevel', () => {
    destinations.normal.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        consoleLevel: 'error',
        message: 'test message'
    });
    assertCalls('error');
    destinations.weird.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
        message: 'test message'
    });
    assertCalls('warn');
    destinations.debug.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        consoleLevel: 'error',
        message: 'test message'
    });
    assertCalls('error');
    destinations.debug.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message'
    });
    assertCalls('debug');
    destinations.info.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
        message: 'test message'
    });
    assertCalls('info');
    destinations.warn.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message'
    });
    assertCalls('warn');
    destinations.error.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message'
    });
    assertCalls('error');
    destinations.debug.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        consoleLevel: 'dumb_console_level',
        message: 'test message'
    });
    assertCalls('log');
});
it('works gracefully for odd scenarios', () => {
    destinations.normal.send();
    assertCalls(''); // expects no log to have happened
    destinations.normal.send({});
    assertCalls('log');
    destinations.debug.send({
        consoleLevel: undefined
    });
    assertCalls('debug');
    destinations.weird.send({
        consoleLevel: null
    });
});
