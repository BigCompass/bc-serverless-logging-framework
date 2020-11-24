"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = exports.initLog = exports.applyComputedProps = exports.applyDefaultProps = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_set_1 = __importDefault(require("lodash.set"));
/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogProps} props - The log props object
 * @returns {Log} the resulting log object
 */
exports.applyDefaultProps = (log, props, propsRoot) => {
    if (props) {
        for (let [propName, prop] of Object.entries(props)) {
            // Reset prop name if propsRoot was passed in
            if (propsRoot) {
                propName = `${propsRoot}.${propName}`;
            }
            // Apply default props
            if (lodash_get_1.default(log, propName) === undefined) {
                if (typeof prop === 'function') {
                    lodash_set_1.default(log, propName, prop(log));
                }
                else {
                    lodash_set_1.default(log, propName, prop);
                }
            }
        }
    }
    return log;
};
/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogComputedProps} computed - Object containing computed functions to run
 * @returns {Log} the resulting log object
 */
exports.applyComputedProps = (log, computed, propsRoot) => {
    if (computed) {
        for (let [propName, fn] of Object.entries(computed)) {
            // Reset prop name if propsRoot was passed in
            if (propsRoot) {
                propName = `${propsRoot}.${propName}`;
            }
            // Apply computed props
            if (typeof fn === 'function') {
                lodash_set_1.default(log, propName, fn(log));
            }
        }
    }
    return log;
};
/**
 * Initialize a log object with the provided log arguments
 * @param {string} level - the log level
 * @param {Array<*>} args - the log arguments
 * @param {string} errorKey - The name of the error property to add for an error argument
 * @returns {Log} The new log object
 */
exports.initLog = (level, args, errorKey) => {
    const log = { level };
    const meta = {
        hasError: false,
        hasMessage: false,
        hasObject: false
    };
    if (!errorKey) {
        errorKey = 'error';
    }
    // Load provided arguemnts into log object
    for (let arg of args) {
        if (arg instanceof Error && !meta.hasError) {
            // Errors are pushed to the errors array
            log[errorKey] = {
                message: arg.message,
                name: arg.name,
                stack: arg.stack
            };
            meta.hasError = true;
        }
        else if (typeof arg === 'object' && !meta.hasObject) {
            // Object values are added to the log object
            Object.assign(log, arg);
            meta.hasObject = true;
        }
        else if (!meta.hasMessage) {
            // Primitive values are passed into the message property
            log.message = arg;
            meta.hasMessage = true;
        }
    }
    return log;
};
/**
 * Create a new log object
 * @param {string} level - The log level
 * @param {Array<*>} args - The log arguments
 * @param {LogProps} logProps - The log props to apply to the log
 * @param {string} errorKey - The name of an error object to use in the log. Defaults to "error"
 */
exports.createLog = (level, args, logProps, computed, propsRoot, errorKey) => {
    // Initialize the log object with provided aruguments
    const log = exports.initLog(level, args, errorKey);
    // Load default props into log object
    exports.applyDefaultProps(log, logProps, propsRoot);
    // Load computed props into log object
    exports.applyComputedProps(log, computed, propsRoot);
    return log;
};
