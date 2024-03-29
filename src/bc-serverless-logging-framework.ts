import { Levels } from './bc-serverless-logging-framework/enums/Levels'
import { destinations } from './bc-serverless-logging-framework/destinations'
import {
  Logger,
  LogProps,
  LagerConfiguration,
  LagerChildOptions
} from './bc-serverless-logging-framework/types'
import { createLog } from './bc-serverless-logging-framework/util/createLog'
import {
  setupTransport,
  runTransports
} from './bc-serverless-logging-framework/util/transport'
import _set from 'lodash.set'

// Shim for promise.allSettled
require('promise.allsettled').shim()

const promises: Array<void | Promise<any>> = []

export const bcLogger = {
  destinations,
  levels: Levels,

  /**
   * Return a logger object based on configuration
   *
   */
  create({
    levels,
    props,
    computed,
    transports,
    errorKey,
    propsRoot
  }: LagerConfiguration = {}) {
    let configuredProperties = props ? { ...props } : {}

    // Set defaults if not provided
    if (!levels?.length) {
      levels = Object.values(bcLogger.levels)
    }
    if (!errorKey) {
      errorKey = 'error'
    }

    if (!transports?.length) {
      console.warn(
        'Warning: no transports added to bcLogger. Logging functionality is disabled'
      )
    }

    if (props && propsRoot) {
      const rootedProps = {}
      _set(rootedProps, propsRoot, props)
      props = rootedProps
    }

    // Set level index onto transport. Log a warning if using a level that doesn't exist
    transports?.forEach((transport) => {
      setupTransport(transport, levels)
    })

    // Set up logger
    const logger: Logger = {
      // Function to set new props after creating a logger
      props(newProps: LogProps): Logger {
        if (propsRoot) {
          _set(props as Object, propsRoot as string, {
            ...props?.propsRoot,
            ...newProps
          })
        } else {
          props = {
            ...props,
            ...newProps
          }
        }

        configuredProperties = {
          ...configuredProperties,
          ...newProps
        }

        return this
      },

      // Function to return a new logger inheriting from this one
      child(childConfig?: LagerConfiguration, options?: LagerChildOptions) {
        if (!childConfig) {
          childConfig = {}
        }
        const conf: LagerConfiguration = {}
        conf.levels = childConfig.levels ?? levels
        conf.propsRoot = childConfig.propsRoot ?? propsRoot
        conf.props = configuredProperties
        if (childConfig.props) {
          conf.props = options?.replaceProps
            ? childConfig.props
            : { ...configuredProperties, ...childConfig.props }
        }

        if (computed && childConfig.computed) {
          conf.computed = options?.replaceComputed
            ? childConfig.computed
            : { ...computed, ...childConfig.computed }
        } else if (childConfig.computed) {
          conf.computed = childConfig.computed
        } else if (computed) {
          conf.computed = computed
        }

        if (transports && childConfig.transports) {
          conf.transports = options?.replaceTransports
            ? childConfig.transports
            : [...transports, ...childConfig.transports]
        } else if (transports) {
          conf.transports = transports
        } else if (childConfig.transports) {
          conf.transports = childConfig.transports
        }

        return bcLogger.create(conf)
      },

      /**
       * Wait for transport promises to finish
       */
      flush(): Promise<any[]> {
        return Promise.allSettled(promises)
      }
    }

    // Set up logger to run transports at each log level
    levels.forEach((level, i) => {
      logger[level] = (...args: Array<string | Object | Error>) => {
        // Create the log object based on arguments/logger props
        const log = createLog(level, args, props, computed, propsRoot, errorKey)

        // Run transports for level and push any promises to the promises array
        const transportPromises = runTransports(log, i, transports)
        promises.push(...transportPromises)
      }
    })
    return logger
  }
}
