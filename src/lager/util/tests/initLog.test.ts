import { lager } from '../../../lager'
import { initLog } from '../createLog'

it('handles blank input gracefully', () => {
  const result = initLog('', [])
  expect(result).toEqual({ level: '' })
})

it('initializes the log object correctly given the provided arguments', () => {
  const result = initLog(lager.levels.info, [
    'test message 123',
    { testprop: 'test 123' }
  ])

  expect(result).toEqual({
    level: lager.levels.info,
    message: 'test message 123',
    testprop: 'test 123'
  })
})

it('sets an error correctly', () => {
  const err = new Error('test error')
  const result = initLog(lager.levels.error, [err])
  expect(result).toEqual({
    level: lager.levels.error,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  })
})

it('sets an error correctly when a custom error key is specified', () => {
  const err = new Error('test error')
  const result = initLog(lager.levels.error, [err], 'errorObject')
  expect(result).toEqual({
    level: lager.levels.error,
    errorObject: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  })
})

it('initializes a log containing only an object', () => {
  const result = initLog(lager.levels.warn, [{ stuff: 'test123' }])
  expect(result).toEqual({
    level: lager.levels.warn,
    stuff: 'test123'
  })
})

it('initializes a log with message in arguments array after object', () => {
  const result = initLog(lager.levels.warn, [{ stuff: 'test123' }, 'message'])
  expect(result).toEqual({
    level: lager.levels.warn,
    message: 'message',
    stuff: 'test123'
  })
})

it('ignored duplicate messages, objects, and errors in the array', () => {
  const err1 = new Error('error 1')
  const err2 = new Error('error 2')
  const err3 = new Error('error 3')

  const result = initLog(lager.levels.info, [
    'message 1',
    { object1: true },
    'message 2',
    'message 3',
    { object2: true },
    err1,
    err2,
    { object3: true },
    err3
  ])

  expect(result).toEqual({
    level: lager.levels.info,
    message: 'message 1',
    object1: true,
    error: {
      name: err1.name,
      message: err1.message,
      stack: err1.stack
    }
  })
})
