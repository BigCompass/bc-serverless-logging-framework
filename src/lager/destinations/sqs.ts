/**
 * Destination for sending directly to an SQS queue
 */

const AWS = require('aws-sdk')
import { DestinationConfigError } from '../errors/DestinationConfigError'
import { Log, Destination, SQSDestinationConfig } from '../types'
import * as SQS from 'aws-sdk/clients/sqs'

export const sqs = (config: SQSDestinationConfig): Destination => {
  let { sqsOptions, queueUrl } = config

  // Set url, throw error if not provided
  if (!queueUrl) {
    throw new DestinationConfigError('SQS Queue URL is required.')
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
      return sqs.sendMessage({
        MessageBody: JSON.stringify(log),
        QueueUrl: queueUrl
      }).promise()
        .catch(error => {
          console.error('Error occurred sending log message to SQS.', { log, error })
        })
    }
  }
}