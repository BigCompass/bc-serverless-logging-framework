import { Transport } from './Transport'

export interface LoggerConfiguration {
  levels?: Array<string>
  props?: Object,
  transports?: Array<Transport>,
  errorKey?: string
}