const initLog = require('./initLog')
const applyDefaultProps = require('./applyDefaultProps')

module.exports = (level, args, logProps, errorKey) => {
  // Initialize the log object with provided aruguments
  const log = initLog(level, args, errorKey)

  // Load default props into log object
  applyDefaultProps(log, logProps)

  // Warn about prop validation errors
  // TODO

  return log
}