import { applyDefaultProps } from '../createLog'
import { Log } from '../../types'

let log: Log
beforeEach(() => {
  log = { message: 'test 123', level: 'info' }
})

it('does nothing if no props are provided', () => {
  applyDefaultProps(log)
  expect(log).toEqual({
    message: 'test 123',
    level: 'info'
  })
})

it('applies default props to log', () => {
  applyDefaultProps(log, {
    testprop: 'abc123',
    data: (log: Log) => `message sent: ${log.message}`
  })
  expect(log).toEqual({
    message: 'test 123',
    level: 'info',
    testprop: 'abc123',
    data: 'message sent: test 123'
  })
})

it('does not apply a prop if it already is in the log object', () => {
  log.testprop = 'test prop 123'
  applyDefaultProps(log, { testprop: 'some other string' })
  expect(log).toEqual({
    message: 'test 123',
    level: 'info',
    testprop: 'test prop 123'
  })
})
