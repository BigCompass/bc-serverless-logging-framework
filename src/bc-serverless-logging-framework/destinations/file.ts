/**
 * Destination for sending directly to a created file
 */

//import * as fs from 'fs';
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

      console.log('>>>>>>>>>>>>>>>'+filePath)
      console.log('>>>>>>>>>>>>>>>'+fileName)

      let fsPromises = fs.writeFile(config.fileName, log)
      return fsPromises
      .catch((error: LoggingFrameworkDestinationConfigError) => {
        console.error('Write file error occured: ', {log, error});
      })

     }
    }

};
