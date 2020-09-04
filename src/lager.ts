import { Levels } from './lager/enums/Levels'
import { destinations } from './lager/destinations'
import { Logger, LogProps, LagerConfiguration } from './lager/types'
import { createLog } from './lager/util/createLog'

const promises: Array<void | Promise<any>> = []

export const lager = {
  destinations,
  levels: Levels,

  /**
   * Return a logger object based on configuration
   *
   */
  create({ levels, props, transports, errorKey }: LagerConfiguration = {}) {
    // Set defaults if not provided
    if (!levels || !levels.length) {
      levels = Object.values(lager.levels)
    }
    if (!errorKey) {
      errorKey = 'error'
    }

    if (!transports) {
      console.warn('Warning: no transports added to lager logger')
    }

    // Set level index onto transport. Log a warning if using a level that doesn't exist
    transports?.forEach((transport) => {
      if (transport.level) {
        transport.levelNumber = levels?.indexOf(transport.level)
        if (transport.levelNumber === -1) {
          console.warn(
            `Invalid level detected in transport: ${transport.level}. This transport will run for all log levels. Valid levels: ${levels}`
          )
        }
      }
    })

    // Set up logger
    const logger: Logger = {
      // Function to set new props after creating a logger
      props(newProps: LogProps): Logger {
        props = {
          ...props,
          ...newProps
        }
        return this
      },

      /**
       * Wait for transport promises to finish
       */
      flush(): Promise<any[]> {
        return Promise.allSettled(promises)
      }
    }

    // Set up log function for each log level
    levels.forEach((level, i) => {
      logger[level] = (...args: Array<string | Object | Error>) => {
        // Create the log object based on arguments/logger props
        const log = createLog(level, args, props, errorKey)

        if (transports && transports.length) {
          for (let transport of transports) {
            if (
              transport.levelNumber === undefined ||
              transport.levelNumber <= i
            ) {
              if (transport.destination) {
                promises.push(transport.destination.send(log))
              } else if (transport.handler) {
                promises.push(transport.handler(log))
              } else {
                throw new Error('Invalid Lager transport: ' + transport)
              }
            }
          }
        }
      }
    })
    return logger
  }
}
