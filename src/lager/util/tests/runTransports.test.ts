import { runTransports } from '../transport'
import { TRANSPORT_LEVEL_ALL } from '../../constants'
import { Log, Transport } from '../../types'

const handlers = {
  handler1: (): null | Promise<any> => null,
  handler2: (): null | Promise<any> => null,
  handler3: (): null | Promise<any> => null
}

const testLog: Log = {
  level: 'test',
  message: 'test message'
}

const spies = {
  handler1: jest.spyOn(handlers, 'handler1'),
  handler2: jest.spyOn(handlers, 'handler2'),
  handler3: jest.spyOn(handlers, 'handler3'),
  consoleWarning: jest.spyOn(console, 'warn').mockReturnValue()
}

const clearSpies = () => Object.values(spies).forEach((spy) => spy.mockClear())

let transports: Array<Transport>

beforeEach(() => {
  transports = [
    {
      handler: handlers.handler1
    },
    {
      levelNumber: TRANSPORT_LEVEL_ALL,
      handler: handlers.handler2
    },
    {
      levelNumber: 3,
      handler: handlers.handler3
    }
  ]
  clearSpies()
})

it('Runs transport at specified levels only', () => {
  runTransports(testLog, 1, transports)
  expect(spies.handler1).toHaveBeenCalled()
  expect(spies.handler2).toHaveBeenCalled()
  expect(spies.handler3).not.toHaveBeenCalled()
  clearSpies()

  runTransports(testLog, 4, transports)
  expect(spies.handler1).toHaveBeenCalled()
  expect(spies.handler2).toHaveBeenCalled()
  expect(spies.handler3).toHaveBeenCalled()
  clearSpies()
})

it('Runs transport if levelNumber not specified', () => {
  runTransports(testLog, undefined, transports)
  expect(spies.handler1).toHaveBeenCalled()
  expect(spies.handler2).toHaveBeenCalled()
  expect(spies.handler3).toHaveBeenCalled()
})

it('Returns promises for any transports that result in promises', async () => {
  spies.handler1.mockReturnValueOnce(Promise.resolve('handler1_result'))
  spies.handler3.mockReturnValueOnce(Promise.resolve('handler3_result'))

  const results: Array<Promise<any>> = runTransports(testLog, 0, transports)
  expect(results.length).toBe(2)

  const promiseResults = await Promise.all(results)
  expect(promiseResults).toEqual(['handler1_result', 'handler3_result'])
})

it('logs a warning if a transport does not have a destination or handler', () => {
  // Add a transport without a destination or handler
  transports.push({})

  // Run transports
  runTransports(testLog, 0, transports)

  // Check that warning was logged for bad transport
  expect(spies.consoleWarning).toHaveBeenCalledWith(
    `Invalid Lager transport: {}. Skipping log`
  )
})

it('runs a destination send() function as expected', () => {
  const testDestination = {
    send: () => undefined
  }
  const destinationSpy = jest.spyOn(testDestination, 'send')

  transports.push({ destination: testDestination })

  runTransports(testLog, 0, transports)

  expect(destinationSpy).toHaveBeenCalledWith(testLog)
})
