"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bc_serverless_logging_framework_1 = require("../../../bc-serverless-logging-framework");
const createLog_1 = require("../createLog");
it('handles blank input gracefully', () => {
    const result = createLog_1.initLog('', []);
    expect(result).toEqual({ level: '' });
});
it('initializes the log object correctly given the provided arguments', () => {
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.info, [
        'test message 123',
        { testprop: 'test 123' }
    ]);
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'test message 123',
        testprop: 'test 123'
    });
});
it('sets an error correctly', () => {
    const err = new Error('test error');
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.error, [err]);
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.error,
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    });
});
it('sets an error correctly when a custom error key is specified', () => {
    const err = new Error('test error');
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.error, [err], 'errorObject');
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.error,
        errorObject: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    });
});
it('initializes a log containing only an object', () => {
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.warn, [{ stuff: 'test123' }]);
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
        stuff: 'test123'
    });
});
it('initializes a log with message in arguments array after object', () => {
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.warn, [
        { stuff: 'test123' },
        'message'
    ]);
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.warn,
        message: 'message',
        stuff: 'test123'
    });
});
it('ignored duplicate messages, objects, and errors in the array', () => {
    const err1 = new Error('error 1');
    const err2 = new Error('error 2');
    const err3 = new Error('error 3');
    const result = createLog_1.initLog(bc_serverless_logging_framework_1.bcLogger.levels.info, [
        'message 1',
        { object1: true },
        'message 2',
        'message 3',
        { object2: true },
        err1,
        err2,
        { object3: true },
        err3
    ]);
    expect(result).toEqual({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'message 1',
        object1: true,
        error: {
            name: err1.name,
            message: err1.message,
            stack: err1.stack
        }
    });
});
