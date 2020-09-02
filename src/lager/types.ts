export interface LagerConfiguration {
  levels?: Array<string>
  props?: LogProps,
  transports?: Array<Transport>,
  errorKey?: string
}

export interface Log {
  message?: string,
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

export interface Destination {
  send(log: Log): void | Promise<any>
}

export interface Transport {
  destination?: Destination
  handler?: Function
}