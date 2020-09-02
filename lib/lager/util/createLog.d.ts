import { Log, LogProps } from "../types";
/**
 * Apply default log props to a provided log object
 * @param {Log} log - The log object to update
 * @param {LogProps} props - The log props object
 * @returns {Log} the resulting log object
 */
export declare const applyDefaultProps: (log: Log, props?: LogProps | undefined) => Log;
/**
 * Initialize a log object with the provided log arguments
 * @param {string} level - the log level
 * @param {Array<*>} args - the log arguments
 * @param {string} errorKey - The name of the error property to add for an error argument
 * @returns {Log} The new log object
 */
export declare const initLog: (level: string, args: Array<any>, errorKey?: string | undefined) => Log;
/**
 * Create a new log object
 * @param {string} level - The log level
 * @param {Array<*>} args - The log arguments
 * @param {LogProps} logProps - The log props to apply to the log
 * @param {string} errorKey - The name of an error object to use in the log. Defaults to "error"
 */
export declare const createLog: (level: string, args: Array<any>, logProps?: LogProps | undefined, errorKey?: string | undefined) => Log;
