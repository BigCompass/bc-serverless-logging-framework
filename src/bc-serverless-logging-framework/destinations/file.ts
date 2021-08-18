/**
 * Destination for sending directly to a created file
 */


import {writeFile} from 'fs';

import { LoggingFrameworkDestinationConfigError } from '../errors/LoggingFrameworkDestinationConfigError'
import { Log, Destination, FileDestinationConfig } from '../types'

export const fileWriter = (config?: FileDestinationConfig): Destination => {
  if (!config) {
    throw new LoggingFrameworkDestinationConfigError(
      'No File Destination config supplied'
    )
  }
  const { filePath, fileName } = config


  const fs = require('fs').promises;
    return {
      send(log: Log) {

        let fsPromises = fs.writeFile(config.filePath + config.fileName, log.message)
        return fsPromises
        .catch((error: LoggingFrameworkDestinationConfigError) => {
          console.error('Write file error occured: ', {log, error});
        })

       }
      }

};
