import { sqs } from './sqs'
import { http } from './http'
import { consoleLog } from './consoleLog'
import { fileWriter } from './file'

export const destinations = {
  sqs,
  http,
  consoleLog,
  fileWriter
}
