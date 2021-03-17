/**
 * Destination for sending logs to an HTTP endpoint
 */
import { LoggingFrameworkDestinationConfigError } from '../errors/LoggingFrameworkDestinationConfigError'
import { Log, Destination } from '../types'
import { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export const http = (config: AxiosRequestConfig): Destination => {
  if (!config) {
    throw new LoggingFrameworkDestinationConfigError(
      'Axios configuration is required for http destination'
    )
  }

  return {
    send(log: Log) {
      config.data = log
      return axios(config).catch((error) => {
        console.error(
          `Error occurred sending log message to endpoint: ${config.url}`,
          { log, error }
        )
      })
    }
  }
}
