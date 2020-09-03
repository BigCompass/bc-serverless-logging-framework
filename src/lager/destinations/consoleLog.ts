import { ConsoleLevels } from '../enums/ConsoleLevels'
import { Destination, Log, ConsoleLogDestinationConfig } from "../types";
import { Levels } from '../enums/Levels';
import { decircularize } from '../util/decircularize'

export const consoleLog = (config?: ConsoleLogDestinationConfig): Destination => ({
  send(log: Log) {

    let logFn
    if ((ConsoleLevels as any)[config?.consoleLevel || log?.consoleLevel || '']) {
      logFn = (console as any)[config?.consoleLevel || log?.consoleLevel || '']
    } else {
      switch (log.level) {
        case Levels.info:
          logFn = console.info
          break
        case Levels.warn:
          logFn = console.warn
          break
        case Levels.debug:
          logFn = console.debug
          break
        case Levels.error:
        case Levels.critical:
          logFn = console.error
          break
        default:
          logFn = console.log
      }
    }

    logFn(JSON.stringify(decircularize(log)))
  }
})