"use strict";
exports.__esModule = true;
exports.runTransports = exports.setupTransport = void 0;
var constants_1 = require("../constants");
/**
 * Setup a transport
 * @param {Transport} transport - The transport to set up
 * @param {Array<string>} levels - The available levels for the transport to run against
 */
var setupTransport = function (transport, levels) {
    // Set the levelNumber based on the transport
    // config and levels available to log to
    if ((transport === null || transport === void 0 ? void 0 : transport.level) && (levels === null || levels === void 0 ? void 0 : levels.length)) {
        var level = transport.level;
        transport.levelNumber = levels.indexOf(level);
        if (transport.levelNumber === -1) {
            console.warn("Invalid level detected in transport: " + level + ". This transport will run for all log levels. Valid levels: " + Object.values(levels));
        }
    }
    else {
        transport.levelNumber = constants_1.TRANSPORT_LEVEL_ALL;
    }
    return transport;
};
exports.setupTransport = setupTransport;
/**
 * Run a set of transports for a given log at a given level number, returning an array of promises for any transports that return promises
 * @param {Log} log - The log to run through transports
 * @param {number} levelNumber - The numeric notation of the level to run the transport for
 * @param {Array<Transport>} transports - Array of transports to run
 * @returns {Arary<Promise>} - Array of promises initiated by the runTransports function
 */
var runTransports = function (log, levelNumber, transports) {
    var transportPromises = [];
    // Filter transports based on level number passed in
    if (levelNumber !== undefined && (transports === null || transports === void 0 ? void 0 : transports.length)) {
        transports = transports.filter(function (transport) {
            return !(transport === null || transport === void 0 ? void 0 : transport.levelNumber) || transport.levelNumber <= levelNumber;
        });
    }
    // Run filtered transports
    transports === null || transports === void 0 ? void 0 : transports.forEach(function (transport) {
        var result;
        // Run transport or log a warning if transport is misconfigured
        if (transport.destination) {
            result = transport.destination.send(log);
        }
        else if (transport.handler) {
            result = transport.handler(log);
        }
        else {
            console.warn("Invalid Lager transport: " + JSON.stringify(transport) + ". Skipping log");
        }
        // Push result to promises array if result is a promise
        if (result instanceof Promise) {
            transportPromises.push(result);
        }
    });
    return transportPromises;
};
exports.runTransports = runTransports;
