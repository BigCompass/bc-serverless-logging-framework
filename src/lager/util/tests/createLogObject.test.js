const util = require('../index')

console.log('UTIL: ', util)

// setup spies/mocks
const mockData = {
  level: 'info',
  args: ['test message'],
  logProps: { test: 'test123' },
  errorKey: 'error',
  log: { testLog: true }
}

const spies = {
  initLog: jest.spyOn(util, 'initLog').mockReturnValue(mockData.testLog),
  applyDefaultProps: jest.spyOn(util, 'applyDefaultProps').mockImplementation((log) => {
    log.testChange = true
  })
}

// Reset spies/mock data for each test
beforeEach(() => {
  Object.values(spies).forEach(spy => spy.mockClear())
  mockData.log = { testLog: true }
})

it('calls helper functions as expected and returns log object', () => {
  const log = util.createLogObject(mockData.level, mockData.args, mockData.logProps, mockData.errorKey)

  expect(spies.initLog).toHaveBeenCalledWith(...[mockData.level, mockData.args, mockData.errorKey])
})  