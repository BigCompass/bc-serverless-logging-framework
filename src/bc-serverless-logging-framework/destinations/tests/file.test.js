"use strict";
exports.__esModule = true;
var file_1 = require("../file");
//import * as assert from 'assert';
var bc_serverless_logging_framework_1 = require("../../../bc-serverless-logging-framework");
//var __importDefault = (this && this.__importDefault) || function (mod) {
//    return (mod && mod.__esModule) ? mod : { "default": mod };
//};
//const assert = __importDefault(require("assert"));
var destinations = {
    single: file_1.fileWriter({ filePath: '/Users/tumulesh2/Documents/Big Compass', fileName: 'newFile.txt' })
};
/*
const spies: any = {
  file: {
    single: jest.spyOn(fileName, 'single').mockImplementation(),
  }
}
*/
it('should write to a new file', function () {
    destinations.single.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'Hello new file. Works as expected.'
    });
});
it('should write to an existing file', function () {
    destinations.single.send({
        level: bc_serverless_logging_framework_1.bcLogger.levels.info,
        message: 'Hello file. Works as expected.'
    });
});
/*

1. String to an existing file
2. String to a new file
3. Use spyOn function


1. Compile and run (and so does file.ts)
  - any downloads/changes to code
2. Learn about spyOn


const destinations = {
  // Will log based on log level
  normal: fileWriter(),

  // Will log based on log level
  weird: fileWriter({ consoleLevel: null }),

  // Will always send debug logs
  debug: fileWriter({ consoleLevel: ConsoleLevels.debug }),

  // Will always send info logs
  info: fileWriter({ consoleLevel: ConsoleLevels.info }),

  // Will always send warn logs
  warn: fileWriter({ consoleLevel: ConsoleLevels.warn }),

  // Will always send error logs
  error: fileWriter({ consoleLevel: ConsoleLevels.error })
}


it('outputs as expected for each bcLogger level', () => {
  destinations.normal.send({
    level: bcLogger.levels.debug,
    message: 'test message'
  })
  assertCalls('debug')

  destinations.normal.send({
    level: bcLogger.levels.info,
    message: 'test message'
  })
  assertCalls('info')

  destinations.normal.send({
    level: bcLogger.levels.warn,
    message: 'test message'
  })
  assertCalls('warn')

  destinations.normal.send({
    level: bcLogger.levels.error,
    message: 'test message'
  })
  assertCalls('error')

  destinations.normal.send({
    level: bcLogger.levels.critical,
    message: 'test message'
  })
  assertCalls('error')

  destinations.normal.send({
    level: 'random_log_level',
    message: 'test message'
  })
  assertCalls('log')
})

it('outputs correctly using fileWriter', () => {
  destinations.normal.send({
    level: bcLogger.levels.info,
    consoleLevel: 'error',
    message: 'test message'
  })
  assertCalls('error')

  destinations.weird.send({
    level: bcLogger.levels.warn,
    message: 'test message'
  })
  assertCalls('warn')

  destinations.debug.send({
    level: bcLogger.levels.info,
    consoleLevel: 'error',
    message: 'test message'
  })
  assertCalls('error')

  destinations.debug.send({
    level: bcLogger.levels.info,
    message: 'test message'
  })
  assertCalls('debug')

  destinations.info.send({
    level: bcLogger.levels.warn,
    message: 'test message'
  })
  assertCalls('info')

  destinations.warn.send({
    level: bcLogger.levels.info,
    message: 'test message'
  })
  assertCalls('warn')

  destinations.error.send({
    level: bcLogger.levels.info,
    message: 'test message'
  })
  assertCalls('error')

  destinations.debug.send({
    level: bcLogger.levels.info,
    consoleLevel: 'dumb_console_level',
    message: 'test message'
  })
  assertCalls('log')
})

it('works gracefully for odd scenarios', () => {
  destinations.normal.send()
  assertCalls('') // expects no output to have happened

  destinations.normal.send({})
  assertCalls('log')

  destinations.debug.send({
    consoleLevel: undefined
  })
  assertCalls('debug')

  destinations.weird.send({
    consoleLevel: null
  })
})
*/
