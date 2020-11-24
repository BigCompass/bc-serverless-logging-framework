import { Log, Transport } from '../types';
/**
 * Setup a transport
 * @param {Transport} transport - The transport to set up
 * @param {Array<string>} levels - The available levels for the transport to run against
 */
export declare const setupTransport: (transport: Transport, levels: Array<string> | undefined) => Transport;
/**
 * Run a set of transports for a given log at a given level number, returning an array of promises for any transports that return promises
 * @param {Log} log - The log to run through transports
 * @param {number} levelNumber - The numeric notation of the level to run the transport for
 * @param {Array<Transport>} transports - Array of transports to run
 * @returns {Arary<Promise>} - Array of promises initiated by the runTransports function
 */
export declare const runTransports: (log: Log, levelNumber: number | undefined, transports: Array<Transport> | undefined) => Promise<any>[];
