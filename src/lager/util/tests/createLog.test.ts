import * as util from '../createLog'

// setup spies/mocks
const mockData = {
  level: 'info',
  args: ['test message'],
  logProps: { test: 'test123' },
  computed: {},
  errorKey: 'error',
  log: { message: '123' }
}

const spies = {
  initLog: jest.spyOn(util, 'initLog').mockReturnValue(mockData.log),
  applyDefaultProps: jest
    .spyOn(util, 'applyDefaultProps')
    .mockImplementation((log) => {
      log.testChange = true
      return log
    })
}

// Reset spies/mock data for each test
beforeEach(() => {
  Object.values(spies).forEach((spy) => spy.mockClear())
  mockData.log = { message: '123' }
})

it('calls helper functions as expected and returns log object', () => {
  const log = util.createLog(
    mockData.level,
    mockData.args,
    mockData.logProps,
    mockData.computed,
    mockData.errorKey
  )

  expect(spies.initLog).toHaveBeenCalledWith(
    ...[mockData.level, mockData.args, mockData.errorKey]
  )
  expect(log).toBeDefined()
})
