import { Levels } from './lager/enums/Levels'
import { destinations } from './lager/destinations'
import { LoggerConfiguration } from './types/LoggerConfiguration'
import { Logger } from './types/logger'

const { createLogObject, applyDefaultProps } = require('./lager/util')

const promises: Array<void | Promise<any>> = []

export const lager = {
  destinations,
  levels: Levels,

  /**
   * Return a logger object based on configuration
   */
  create({ levels, props, transports, errorKey }: LoggerConfiguration) {

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

    // Set up logger
    const logger: Logger = {
      // Function to set new props after creating a logger
      props(newProps: Object): Object {
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
        return Promise.all(promises)
      },
    }

    // Set up log function for each log level
    levels.forEach(level => {
      logger[level] = (...args: Array<string | Object | Error>) => {
        // Create the log object based on arguments/logger props
        const log = createLogObject(level, args, props, errorKey)

        if (transports && transports.length) {
          for (let transport of transports) {
            if (transport.destination) {
              console.log('sending to destination')
              promises.push(transport.destination.send(log))
            } else if (transport.handler) {
              promises.push(transport.handler(log))
            } else {
              throw new Error('Invalid Lager transport: ' + transport)
            }

          }
        }
      }
    })
    return logger
  },
}