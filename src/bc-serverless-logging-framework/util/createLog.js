"use strict";
exports.__esModule = true;
exports.createLog = exports.initLog = exports.applyComputedProps = exports.applyDefaultProps = void 0;
var lodash_get_1 = require("lodash.get");
var lodash_set_1 = require("lodash.set");
/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogProps} props - The log props object
 * @returns {Log} the resulting log object
 */
var applyDefaultProps = function (log, props, propsRoot) {
    if (props) {
        for (var _i = 0, _a = Object.entries(props); _i < _a.length; _i++) {
            var _b = _a[_i], propName = _b[0], prop = _b[1];
            // Reset prop name if propsRoot was passed in
            if (propsRoot) {
                propName = propsRoot + "." + propName;
            }
            // Apply default props
            if (lodash_get_1["default"](log, propName) === undefined) {
                if (typeof prop === 'function') {
                    lodash_set_1["default"](log, propName, prop(log));
                }
                else {
                    lodash_set_1["default"](log, propName, prop);
                }
            }
        }
    }
    return log;
};
exports.applyDefaultProps = applyDefaultProps;
/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogComputedProps} computed - Object containing computed functions to run
 * @returns {Log} the resulting log object
 */
var applyComputedProps = function (log, computed, propsRoot) {
    if (computed) {
        for (var _i = 0, _a = Object.entries(computed); _i < _a.length; _i++) {
            var _b = _a[_i], propName = _b[0], fn = _b[1];
            // Reset prop name if propsRoot was passed in
            if (propsRoot) {
                propName = propsRoot + "." + propName;
            }
            // Apply computed props
            if (typeof fn === 'function') {
                lodash_set_1["default"](log, propName, fn(log));
            }
        }
    }
    return log;
};
exports.applyComputedProps = applyComputedProps;
/**
 * Initialize a log object with the provided log arguments
 * @param {string} level - the log level
 * @param {Array<*>} args - the log arguments
 * @param {string} errorKey - The name of the error property to add for an error argument
 * @returns {Log} The new log object
 */
var initLog = function (level, args, errorKey) {
    var log = { level: level };
    var meta = {
        hasError: false,
        hasMessage: false,
        hasObject: false
    };
    if (!errorKey) {
        errorKey = 'error';
    }
    // Load provided arguemnts into log object
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
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
exports.initLog = initLog;
/**
 * Create a new log object
 * @param {string} level - The log level
 * @param {Array<*>} args - The log arguments
 * @param {LogProps} logProps - The log props to apply to the log
 * @param {string} errorKey - The name of an error object to use in the log. Defaults to "error"
 */
var createLog = function (level, args, logProps, computed, propsRoot, errorKey) {
    // Initialize the log object with provided aruguments
    var log = exports.initLog(level, args, errorKey);
    // Load default props into log object
    exports.applyDefaultProps(log, logProps, propsRoot);
    // Load computed props into log object
    exports.applyComputedProps(log, computed, propsRoot);
    return log;
};
exports.createLog = createLog;
