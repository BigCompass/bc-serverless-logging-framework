export interface Logger {
  props: Function
  flush: Function
  [x: string]: Function
}