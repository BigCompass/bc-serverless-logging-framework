import { fileWriter } from '../file'
import { bcLogger } from '../../../bc-serverless-logging-framework'

const destinations = {

  single: fileWriter({filePath: '/Users/tumulesh2/Documents/Big Compass/bc-serverless-logging-framework/src/bc-serverless-logging-framework/', fileName: 'newFile.txt'})
}

it('should write to a new file', () => {
   destinations.single.send({
//    level: bcLogger.levels.info,
    message: 'Hello new file. Works as expected.'
  })
})
/*


it('should write to an existing file', () => {
   destinations.single.send({
    level: bcLogger.levels.info,
    message: 'Hello file. Works as expected.'
  })
})




/*

1. String to an existing file
2. String to a new file
3. Use spyOn function


1. Compile and run (and so does file.ts)
  - any downloads/changes to code
2. Learn about spyOn


const spies: any = {
  file: {
    single: jest.spyOn(fileName, 'single').mockImplementation(),
  }
}
*/
