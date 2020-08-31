/**
 * Destination for sending directly to an SQS queue
 */

const AWS = require('aws-sdk')
const DestinationError = require('../errors/DestinationError')

module.exports = ({ sqsOptions, queueUrl } = {}) => {

  // Validate input
  if (!queueUrl) {
    throw new DestinationError('SQS Queue URL is required.')
  }

  // SQS setup
  sqsOptions = sqsOptions || {}
  if (!sqsOptions.apiVersion) {
    sqsOptions.apiVersion = '2012-11-05'
  }
  if (!sqsOptions.region) {
    sqsOptions.region = 'us-east-1'
  }

  const sqs = new AWS.SQS(sqsOptions)
  return {
    send(log) {
      return new Promise(resolve => {
        sqs.sendMessage({
          MessageBody: JSON.stringify(log),
          QueueUrl: queueUrl
        }).promise()
          .then(res => {
            console.log('SQS response: ', JSON.stringify(res))
          })
          .catch(error => {
            console.error('Error occurred sending log message to SQS.', { log, error })
          })
          .finally(resolve)
      })
    }
  }
}