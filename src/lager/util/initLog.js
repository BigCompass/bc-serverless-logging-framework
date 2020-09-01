module.exports = (level, args, errorKey) => {
  const log = { level }
  const meta = {
    hasError: false,
    hasMessage: false,
    hasObject: false
  }

  // Load provided arguemnts into log object
  for (let arg of args) {
    if (arg instanceof Error && !meta.hasError) {
      // Errors are pushed to the errors array
      log[errorKey] = {
        message: arg.message,
        name: arg.name,
        stack: arg.stack
      }
      meta.hasError = true
    } else if (typeof arg === 'object' && !meta.hasObject) {
      // Object values are added to the log object
      Object.assign(log, arg)
      meta.hasObject = true
    } else if (!meta.hasMessage) {
      // Primitive values are passed into the message property
      log.message = arg
      meta.hasMessage = true
    }
  }

  return log
}