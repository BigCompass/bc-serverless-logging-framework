const { createLogObject, applyDefaultProps } = require('./lager/util')

const lager = {
  destinations: require('./lager/destinations'),
  levels: require('./lager/levels')
}

const promises = []

module.exports = {
  /**
   * Return a logger object based on configuration
   */
  create({ levels, props, transports, errorKey } = {}) {

    // Set defaults if not provided
    if (!levels || !levels.length) {
      levels = Object.values(lager.levels)
    }
    if (!errorKey) {
      errorKey = 'error'
    }
    if (!transports) {
      transports = []
      console.warn('Warning: no transports added to lager logger')
    }

    // Set up logger
    const logger = {
      // Function to set new props after creating a logger
      props(newProps) {
        props = {
          ...props,
          ...newProps
        }
        return this
      },

      /**
       * Wait for transport promises to finish
       */
      flush() {
        return Promise.all(promises)
      },
    }

    // Set up log function for each log level
    levels.forEach(level => {
      logger[level] = (...args) => {
        // Create the log object based on arguments/logger props
        const log = createLogObject(level, args, props, errorKey)

        for (let transport of transports) {
          if (transport.destination) {
            console.log('sending to destination')
            promises.push(transport.destination.send(log))
          } else if (transport.handler) {
            promises.push(transport.handler(log))
          } else if (typeof transport === 'function') {
            promises.push(transport(log))
          }
        }
      }
    })
    return logger
  },

  // Expose lager values in the library
  ...lager
}