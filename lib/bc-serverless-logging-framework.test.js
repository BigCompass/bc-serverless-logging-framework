"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bc_serverless_logging_framework_1 = require("./bc-serverless-logging-framework");
const spies = {
    console: {
        info: jest.spyOn(console, 'info').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation()
    }
};
beforeEach(() => {
    spies.console.info.mockClear();
    spies.console.warn.mockClear();
    spies.console.error.mockClear();
});
it('creates a logger with default levels as functions', () => {
    const logger = bc_serverless_logging_framework_1.bcLogger.create();
    for (let level of Object.values(bc_serverless_logging_framework_1.bcLogger.levels)) {
        expect(typeof logger[level]).toBe('function');
    }
});
it('create a logger with specified levels when provided', () => {
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        levels: ['test_level_1', 'test_level_2', bc_serverless_logging_framework_1.bcLogger.levels.info]
    });
    expect(typeof logger.test_level_1).toBe('function');
    expect(typeof logger.test_level_2).toBe('function');
    expect(typeof logger[bc_serverless_logging_framework_1.bcLogger.levels.info]).toBe('function');
});
it('logs with default props when specified', () => {
    // Setup
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        props: {
            testprop1: 'abc',
            testprop2: 123,
            testprop3: {
                test: true
            },
            testprop4(log) {
                return `Log message contains the following text: ${log.message}. Level: ${log.level}`;
            }
        },
        transports: [
            {
                destination: bc_serverless_logging_framework_1.bcLogger.destinations.consoleLog()
            }
        ]
    });
    // Run
    logger.info('test message 123');
    // Assert
    const [logData] = spies.console.info.mock.calls[0];
    expect(JSON.parse(logData)).toMatchObject({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message 123',
        testprop1: 'abc',
        testprop2: 123,
        testprop3: {
            test: true
        },
        testprop4: 'Log message contains the following text: test message 123. Level: info'
    });
});
it('sets new default props onto the logger using the props() method', () => {
    // Setup
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        transports: [
            {
                destination: bc_serverless_logging_framework_1.bcLogger.destinations.consoleLog()
            }
        ]
    });
    // Run
    logger.props({ testprop: '1234' });
    logger.info('test message');
    // Assert
    const [logData] = spies.console.info.mock.calls[0];
    expect(JSON.parse(logData)).toMatchObject({
        message: 'test message',
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        testprop: '1234'
    });
});
it('utilizes transport level correctly', () => {
    // Setup
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        transports: [
            {
                level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
                destination: bc_serverless_logging_framework_1.bcLogger.destinations.consoleLog()
            }
        ]
    });
    // Run
    logger.info('test info message');
    logger.warn('test warn message');
    logger.error('test error message');
    // Assert
    const [warnLogData] = spies.console.warn.mock.calls[0];
    expect(JSON.parse(warnLogData)).toEqual({
        message: 'test warn message',
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn
    });
    const [errorLogData] = spies.console.error.mock.calls[0];
    expect(JSON.parse(errorLogData)).toEqual({
        message: 'test error message',
        level: bc_serverless_logging_framework_1.bcLogger.levels.error
    });
    expect(spies.console.info).not.toHaveBeenCalled();
});
it('logs a warning if an invalid level is used for a transport', () => {
    bc_serverless_logging_framework_1.bcLogger.create({
        transports: [
            {
                level: 'dummy_level',
                destination: bc_serverless_logging_framework_1.bcLogger.destinations.consoleLog()
            }
        ]
    });
    expect(spies.console.warn).toHaveBeenCalledWith(`Invalid level detected in transport: dummy_level. This transport will run for all log levels. Valid levels: ${Object.values(bc_serverless_logging_framework_1.bcLogger.levels)}`);
});
it('handles rejected promises gracefully when running flush()', () => __awaiter(void 0, void 0, void 0, function* () {
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        transports: [
            {
                handler: (log) => (log.fail ? Promise.reject() : Promise.resolve())
            }
        ]
    });
    logger.info('test message');
    logger.error('this message will fail to send.', { fail: true });
    const results = yield logger.flush();
    expect(results.find((result) => result.status === 'rejected')).toBeDefined();
}));
it('loads errorKey correctly', () => {
    const logger = bc_serverless_logging_framework_1.bcLogger.create({
        transports: [
            {
                destination: bc_serverless_logging_framework_1.bcLogger.destinations.consoleLog()
            }
        ],
        errorKey: 'my_error_object'
    });
    const err = new Error('test error');
    logger.error('An error occurred', err);
    const [errorLogData] = spies.console.error.mock.calls[0];
    expect(JSON.parse(errorLogData)).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.error,
        message: 'An error occurred',
        my_error_object: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    });
});
