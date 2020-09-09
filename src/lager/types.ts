import * as SQS from 'aws-sdk/clients/sqs'

export interface LagerConfiguration {
  levels?: Array<string>
  props?: LogProps
  transports?: Array<Transport>
  errorKey?: string
}

export interface Log {
  level?: string
  message?: string
  [x: string]: any
}

export interface LogProps {
  [x: string]: any
}

export interface Logger {
  props: Function
  flush: Function
  [x: string]: Function
}

export interface Transport {
  destination?: Destination
  handler?: Function
  level?: string
  levelNumber?: number
}

export interface Destination {
  // eslint-disable-next-line no-unused-vars
  send(log?: Log): void | Promise<any>
}

export interface ConsoleType {
  debug: Function
  info: Function
  warn: Function
  error: Function
}

export interface ConsoleLogDestinationConfig {
  consoleLevel?: string | null
}

export interface SQSDestinationConfig {
  sqsOptions?: SQS.Types.ClientConfiguration
  queueUrl: string
}

export interface RunTransportsConfig {
  log: Log
  level: string
  transports: Array<Transport>
}

export interface HttpDestinationOptions {
  logProperty?: string
}
