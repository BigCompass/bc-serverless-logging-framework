"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lager = void 0;
const Levels_1 = require("./lager/enums/Levels");
const destinations_1 = require("./lager/destinations");
const createLog_1 = require("./lager/util/createLog");
const transport_1 = require("./lager/util/transport");
const lodash_set_1 = __importDefault(require("lodash.set"));
const promises = [];
exports.lager = {
    destinations: destinations_1.destinations,
    levels: Levels_1.Levels,
    /**
     * Return a logger object based on configuration
     *
     */
    create({ levels, props, computed, transports, errorKey, propsRoot } = {}) {
        let configuredProperties = props ? Object.assign({}, props) : {};
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
        if (props && propsRoot) {
            const rootedProps = {};
            lodash_set_1.default(rootedProps, propsRoot, props);
            props = rootedProps;
        }
        // Set level index onto transport. Log a warning if using a level that doesn't exist
        transports === null || transports === void 0 ? void 0 : transports.forEach((transport) => {
            transport_1.setupTransport(transport, levels);
        });
        // Set up logger
        const logger = {
            // Function to set new props after creating a logger
            props(newProps) {
                if (propsRoot) {
                    lodash_set_1.default(props, propsRoot, Object.assign(Object.assign({}, props === null || props === void 0 ? void 0 : props.propsRoot), newProps));
                }
                else {
                    props = Object.assign(Object.assign({}, props), newProps);
                }
                configuredProperties = Object.assign(Object.assign({}, configuredProperties), newProps);
                return this;
            },
            // Function to return a new logger inheriting from this one
            child(childConfig, options) {
                var _a, _b;
                if (!childConfig) {
                    childConfig = {};
                }
                const conf = {};
                conf.levels = (_a = childConfig.levels) !== null && _a !== void 0 ? _a : levels;
                conf.propsRoot = (_b = childConfig.propsRoot) !== null && _b !== void 0 ? _b : propsRoot;
                conf.props = configuredProperties;
                if (childConfig.props) {
                    conf.props = (options === null || options === void 0 ? void 0 : options.replaceProps) ? childConfig.props
                        : Object.assign(Object.assign({}, configuredProperties), childConfig.props);
                }
                if (computed && childConfig.computed) {
                    conf.computed = (options === null || options === void 0 ? void 0 : options.replaceComputed) ? childConfig.computed
                        : Object.assign(Object.assign({}, computed), childConfig.computed);
                }
                else if (childConfig.computed) {
                    conf.computed = childConfig.computed;
                }
                else if (computed) {
                    conf.computed = computed;
                }
                if (transports && childConfig.transports) {
                    conf.transports = (options === null || options === void 0 ? void 0 : options.replaceTransports) ? childConfig.transports
                        : [...transports, ...childConfig.transports];
                }
                else if (transports) {
                    conf.transports = transports;
                }
                else if (childConfig.transports) {
                    conf.transports = childConfig.transports;
                }
                return exports.lager.create(conf);
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
                const log = createLog_1.createLog(level, args, props, computed, propsRoot, errorKey);
                // Run transports for level and push any promises to the promises array
                const transportPromises = transport_1.runTransports(log, i, transports);
                promises.push(...transportPromises);
            };
        });
        return logger;
    }
};
