const lager = require('./lager')

it('creates a logger with default levels as functions', () => {
  const logger = lager.createLogger()
  lager.levels.forEach(level => {
    expect(typeof logger[level]).toBe('function')
  })
})