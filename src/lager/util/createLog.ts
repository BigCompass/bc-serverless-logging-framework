import { Log, LogProps, LogComputedProps } from '../types'
import _get from 'lodash.get'
import _set from 'lodash.set'

/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogProps} props - The log props object
 * @returns {Log} the resulting log object
 */
export const applyDefaultProps = (
  log: Log,
  props?: LogProps,
  propsRoot?: string
): Log => {
  if (props) {
    for (let [propName, prop] of Object.entries(props)) {
      // Reset prop name if propsRoot was passed in
      if (propsRoot) {
        propName = `${propsRoot}.${propName}`
      }

      // Apply default props
      if (_get(log, propName) === undefined) {
        if (typeof prop === 'function') {
          _set(log, propName, prop(log))
        } else {
          _set(log, propName, prop)
        }
      }
    }
  }

  return log
}

/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogComputedProps} computed - Object containing computed functions to run
 * @returns {Log} the resulting log object
 */
export const applyComputedProps = (
  log: Log,
  computed?: LogComputedProps,
  propsRoot?: string
) => {
  if (computed) {
    console.log('RUNNING COMPUTED')
    console.log(JSON.stringify(computed))
    for (let [propName, fn] of Object.entries(computed)) {
      // Reset prop name if propsRoot was passed in
      if (propsRoot) {
        propName = `${propsRoot}.${propName}`
      }

      // Apply computed props
      if (typeof fn === 'function') {
        _set(log, propName, fn(log))
      }
    }
  }

  return log
}

/**
 * Initialize a log object with the provided log arguments
 * @param {string} level - the log level
 * @param {Array<*>} args - the log arguments
 * @param {string} errorKey - The name of the error property to add for an error argument
 * @returns {Log} The new log object
 */
export const initLog = (
  level: string,
  args: Array<any>,
  errorKey?: string
): Log => {
  const log: Log = { level }
  const meta = {
    hasError: false,
    hasMessage: false,
    hasObject: false
  }
  if (!errorKey) {
    errorKey = 'error'
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

/**
 * Create a new log object
 * @param {string} level - The log level
 * @param {Array<*>} args - The log arguments
 * @param {LogProps} logProps - The log props to apply to the log
 * @param {string} errorKey - The name of an error object to use in the log. Defaults to "error"
 */
export const createLog = (
  level: string,
  args: Array<any>,
  logProps?: LogProps,
  computed?: LogComputedProps,
  propsRoot?: string,
  errorKey?: string
): Log => {
  // Initialize the log object with provided aruguments
  const log: Log = initLog(level, args, errorKey)

  // Load default props into log object
  applyDefaultProps(log, logProps, propsRoot)

  // Load computed props into log object
  applyComputedProps(log, computed, propsRoot)

  return log
}
