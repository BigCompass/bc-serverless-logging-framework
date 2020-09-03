"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lager = void 0;
const Levels_1 = require("./lager/enums/Levels");
const destinations_1 = require("./lager/destinations");
const createLog_1 = require("./lager/util/createLog");
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
        if (!levels || !levels.length) {
            levels = Object.values(exports.lager.levels);
        }
        if (!errorKey) {
            errorKey = 'error';
        }
        if (!transports) {
            console.warn('Warning: no transports added to lager logger');
        }
        // Set level index onto transport. Log a warning if using a level that doesn't exist
        transports === null || transports === void 0 ? void 0 : transports.forEach(transport => {
            if (transport.level) {
                transport.levelNumber = levels === null || levels === void 0 ? void 0 : levels.indexOf(transport.level);
                if (transport.levelNumber === -1) {
                    console.warn(`Invalid level detected in transport: ${transport.level}. This transport will run for all log levels. Valid levels: ${levels}`);
                }
            }
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
            },
        };
        // Set up log function for each log level
        levels.forEach((level, i) => {
            logger[level] = (...args) => {
                // Create the log object based on arguments/logger props
                const log = createLog_1.createLog(level, args, props, errorKey);
                if (transports && transports.length) {
                    for (let transport of transports) {
                        if (transport.levelNumber === undefined || transport.levelNumber <= i) {
                            if (transport.destination) {
                                promises.push(transport.destination.send(log));
                            }
                            else if (transport.handler) {
                                promises.push(transport.handler(log));
                            }
                            else {
                                throw new Error('Invalid Lager transport: ' + transport);
                            }
                        }
                    }
                }
            };
        });
        return logger;
    },
};
