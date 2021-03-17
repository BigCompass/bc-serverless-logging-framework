/**
 * Destination for sending directly to an SQS queue
 */

const AWS = require('aws-sdk')
import { LoggingFrameworkDestinationConfigError } from '../errors/LoggingFrameworkDestinationConfigError'
import { Log, Destination, SQSDestinationConfig } from '../types'
import * as SQS from 'aws-sdk/clients/sqs'
import { decircularize } from '../util/decircularize'

export const sqs = (config: SQSDestinationConfig): Destination => {
  if (!config) {
    throw new LoggingFrameworkDestinationConfigError(
      'No SQS Destination config supplied'
    )
  }
  let { sqsOptions, queueUrl } = config

  // Set url, throw error if not provided
  if (!queueUrl) {
    throw new LoggingFrameworkDestinationConfigError(
      'SQS Queue URL is required.'
    )
  }

  // Setup default sqs options
  sqsOptions = sqsOptions || {}
  if (!sqsOptions.apiVersion) {
    sqsOptions.apiVersion = '2012-11-05'
  }
  if (!sqsOptions.region) {
    sqsOptions.region = 'us-east-1'
  }
  const sqs: SQS = new AWS.SQS(sqsOptions)

  return {
    send(log: Log) {
      return sqs
        .sendMessage({
          MessageBody: JSON.stringify(decircularize(log)),
          QueueUrl: queueUrl
        })
        .promise()
        .catch((error) => {
          console.error('Error occurred sending log message to SQS.', {
            log,
            error
          })
        })
    }
  }
}
