/**
 * Destination for sending directly to an SQS queue
 */
import { Destination, HttpDestinationOptions } from '../types';
import { AxiosRequestConfig } from 'axios';
export declare const http: (config: AxiosRequestConfig, options?: HttpDestinationOptions | undefined) => Destination;
