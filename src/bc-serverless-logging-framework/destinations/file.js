"use strict";
/**
 * Destination for sending directly to a created file
 */
exports.__esModule = true;
exports.fileWriter = void 0;
var LoggingFrameworkDestinationConfigError_1 = require("../errors/LoggingFrameworkDestinationConfigError");
var fileWriter = function (config) {
    if (!config) {
        throw new LoggingFrameworkDestinationConfigError_1.LoggingFrameworkDestinationConfigError('No File Destination config supplied');
    }
    var filePath = config.filePath, fileName = config.fileName;
    //let fsPromises = fs.promises;
    var fs = require('fs').promises;
    return {
        send: function (log) {
            //      config.data = log;
            //      return fsPromises.writeFile(fileName, log)
            var fsPromises = fs.writeFile(fileName, log);
            return fsPromises["catch"](function (error) {
                console.error('Write file error occured: ', { log: log, error: error });
            });
        }
    };
};
exports.fileWriter = fileWriter;
