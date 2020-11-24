import { consoleLog } from '../consoleLog'
import { ConsoleLevels } from '../../enums/ConsoleLevels'
import { bcLogger } from '../../../bc-serverless-logging-framework'
import { Log } from '../../types'

const destinations = {
  // Will log based on log level
  normal: consoleLog(),

  // Will log based on log level
  weird: consoleLog({ consoleLevel: null }),

  // Will always send debug logs
  debug: consoleLog({ consoleLevel: ConsoleLevels.debug }),

  // Will always send info logs
  info: consoleLog({ consoleLevel: ConsoleLevels.info }),

  // Will always send warn logs
  warn: consoleLog({ consoleLevel: ConsoleLevels.warn }),

  // Will always send error logs
  error: consoleLog({ consoleLevel: ConsoleLevels.error })
}

const spies: any = {
  console: {
    debug: jest.spyOn(console, 'debug').mockImplementation(),
    info: jest.spyOn(console, 'info').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    log: jest.spyOn(console, 'log').mockImplementation()
  }
}

const assertCalls = (logFn: string) => {
  for (let key in spies.console) {
    const spy = spies.console[key]
    const callsExpected = key === logFn ? 1 : 0
    expect(spy).toHaveBeenCalledTimes(callsExpected)
    spy.mockClear()
  }
}

it('logs as expected for each bcLogger level', () => {
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

it('logs correctly using consoleLevel', () => {
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
  assertCalls('') // expects no log to have happened

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
