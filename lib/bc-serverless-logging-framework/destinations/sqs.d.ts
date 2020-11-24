/**
 * Destination for sending directly to an SQS queue
 */
import { Destination, SQSDestinationConfig } from '../types';
export declare const sqs: (config: SQSDestinationConfig) => Destination;
