"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lager = void 0;
const Levels_1 = require("./lager/enums/Levels");
const destinations_1 = require("./lager/destinations");
const createLog_1 = require("./lager/util/createLog");
const transport_1 = require("./lager/util/transport");
const promises = [];
exports.lager = {
    destinations: destinations_1.destinations,
    levels: Levels_1.Levels,
    /**
     * Return a logger object based on configuration
     *
     */
    create({ levels, props, transports, errorKey } = {}) {
        // Set defaults if not provided
        if (!(levels === null || levels === void 0 ? void 0 : levels.length)) {
            levels = Object.values(exports.lager.levels);
        }
        if (!errorKey) {
            errorKey = 'error';
        }
        if (!transports) {
            console.warn('Warning: no transports added to lager logger');
        }
        // Set level index onto transport. Log a warning if using a level that doesn't exist
        transports === null || transports === void 0 ? void 0 : transports.forEach((transport) => {
            transport_1.setupTransport(transport, levels);
        });
        // Set up logger
        const logger = {
            // Function to set new props after creating a logger
            props(newProps) {
                props = Object.assign(Object.assign({}, props), newProps);
                return this;
            },
            /**
             * Wait for transport promises to finish
             */
            flush() {
                return Promise.allSettled(promises);
            }
        };
        // Set up logger to run transports at each log level
        levels.forEach((level, i) => {
            logger[level] = (...args) => {
                // Create the log object based on arguments/logger props
                const log = createLog_1.createLog(level, args, props, errorKey);
                // Run transports for level and push any promises to the promises array
                const transportPromises = transport_1.runTransports(log, i, transports);
                promises.push(...transportPromises);
            };
        });
        return logger;
    }
};
