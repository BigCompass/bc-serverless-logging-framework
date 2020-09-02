/**
 * Destination for sending directly to an SQS queue
 */
import { Destination } from '../types';
import * as SQS from 'aws-sdk/clients/sqs';
export interface SQSDestinationConfig {
    sqsOptions?: SQS.Types.ClientConfiguration;
    queueUrl: string;
}
export declare const sqs: (config: SQSDestinationConfig) => Destination;
