import { ConsoleLevels } from '../enums/ConsoleLevels'
import { Destination, Log, ConsoleLogDestinationConfig } from '../types'
import { Levels } from '../enums/Levels'
import { decircularize } from '../util/decircularize'

export const consoleLog = (
  config?: ConsoleLogDestinationConfig
): Destination => ({
  send(log?: Log) {
    if (!log) {
      return
    }
    // Retrieve the log function
    let logFn: Function
    let level = ''
    if (log.consoleLevel || config?.consoleLevel) {
      level = log.consoleLevel || config?.consoleLevel
    } else if (log.level) {
      level = log.level
    }

    switch (level) {
      case Levels.debug:
      case ConsoleLevels.debug:
        logFn = console.debug
        break
      case Levels.info:
      case ConsoleLevels.info:
        logFn = console.info
        break
      case Levels.warn:
      case ConsoleLevels.warn:
        logFn = console.warn
        break
      case Levels.error:
      case Levels.critical:
      case ConsoleLevels.error:
        logFn = console.error
        break
      default:
        logFn = console.log
    }

    // Log to the console
    logFn(JSON.stringify(decircularize(log)))
  }
})
