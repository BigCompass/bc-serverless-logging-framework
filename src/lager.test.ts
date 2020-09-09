import { lager } from './lager'
import { Log } from './lager/types'

const spies = {
  console: {
    info: jest.spyOn(console, 'info').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation()
  }
}

beforeEach(() => {
  spies.console.info.mockClear()
  spies.console.warn.mockClear()
  spies.console.error.mockClear()
})

it('creates a logger with default levels as functions', () => {
  const logger = lager.create()
  for (let level of Object.values(lager.levels)) {
    expect(typeof logger[level]).toBe('function')
  }
})

it('create a logger with specified levels when provided', () => {
  const logger = lager.create({
    levels: ['test_level_1', 'test_level_2', lager.levels.info]
  })
  expect(typeof logger.test_level_1).toBe('function')
  expect(typeof logger.test_level_2).toBe('function')
  expect(typeof logger[lager.levels.info]).toBe('function')
})

it('logs with default props when specified', () => {
  // Setup
  const logger = lager.create({
    props: {
      testprop1: 'abc',
      testprop2: 123,
      testprop3: {
        test: true
      },
      testprop4(log: Log) {
        return `Log message contains the following text: ${log.message}. Level: ${log.level}`
      }
    },
    transports: [
      {
        destination: lager.destinations.consoleLog()
      }
    ]
  })

  // Run
  logger.info('test message 123')

  // Assert
  const [logData] = spies.console.info.mock.calls[0]
  expect(JSON.parse(logData)).toMatchObject({
    level: lager.levels.info,
    message: 'test message 123',
    testprop1: 'abc',
    testprop2: 123,
    testprop3: {
      test: true
    },
    testprop4:
      'Log message contains the following text: test message 123. Level: info'
  })
})

it('sets new default props onto the logger using the props() method', () => {
  // Setup
  const logger = lager.create({
    transports: [
      {
        destination: lager.destinations.consoleLog()
      }
    ]
  })

  // Run
  logger.props({ testprop: '1234' })
  logger.info('test message')

  // Assert
  const [logData] = spies.console.info.mock.calls[0]
  expect(JSON.parse(logData)).toMatchObject({
    message: 'test message',
    level: lager.levels.info,
    testprop: '1234'
  })
})

it('utilizes transport level correctly', () => {
  // Setup
  const logger = lager.create({
    transports: [
      {
        level: lager.levels.warn,
        destination: lager.destinations.consoleLog()
      }
    ]
  })

  // Run
  logger.info('test info message')
  logger.warn('test warn message')
  logger.error('test error message')

  // Assert
  const [warnLogData] = spies.console.warn.mock.calls[0]
  expect(JSON.parse(warnLogData)).toEqual({
    message: 'test warn message',
    level: lager.levels.warn
  })

  const [errorLogData] = spies.console.error.mock.calls[0]
  expect(JSON.parse(errorLogData)).toEqual({
    message: 'test error message',
    level: lager.levels.error
  })

  expect(spies.console.info).not.toHaveBeenCalled()
})

it('logs a warning if an invalid level is used for a transport', () => {
  lager.create({
    transports: [
      {
        level: 'dummy_level',
        destination: lager.destinations.consoleLog()
      }
    ]
  })

  expect(spies.console.warn).toHaveBeenCalledWith(
    `Invalid level detected in transport: dummy_level. This transport will run for all log levels. Valid levels: ${Object.values(
      lager.levels
    )}`
  )
})

it('handles rejected promises gracefully when running flush()', async () => {
  const logger = lager.create({
    transports: [
      {
        handler: (log: Log) => (log.fail ? Promise.reject() : Promise.resolve())
      }
    ]
  })

  logger.info('test message')
  logger.error('this message will fail to send.', { fail: true })

  const results = await logger.flush()
  expect(
    results.find((result: any) => result.status === 'rejected')
  ).toBeDefined()
})

it('loads errorKey correctly', () => {
  const logger = lager.create({
    transports: [
      {
        destination: lager.destinations.consoleLog()
      }
    ],
    errorKey: 'my_error_object'
  })

  const err = new Error('test error')

  logger.error('An error occurred', err)

  const [errorLogData] = spies.console.error.mock.calls[0]
  expect(JSON.parse(errorLogData)).toEqual({
    level: lager.levels.error,
    message: 'An error occurred',
    my_error_object: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  })
})
