import { sqs } from './sqs'
import { http } from './http'
import { consoleLog } from './consoleLog'

export const destinations = {
  sqs,
  http,
  consoleLog
}
