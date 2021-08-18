import { fileWriter } from '../file'
import { bcLogger } from '../../../bc-serverless-logging-framework'

const destinations = {

  single: fileWriter({filePath: '/Users/tumulesh2/Documents/Big Compass/bc-serverless-logging-framework/src/bc-serverless-logging-framework/', fileName: 'newFile.txt'}),
//  second: fileWriter({filePath: '/Users/tumulesh2/Documents/Big Compass/bc-serverless-logging-framework/src/bc-serverless-logging-framework/', fileName: 'existingFile.txt'})
}


//@ts-ignore
const spy: any = jest.spyOn(fileWriter, 'fileWriter').mockImplementation()


it('should write to a new file', () => {
   destinations.single.send({
    message: 'Hello new file. Works as expected.\n'
  })
  expect(spy).toHaveBeenCalledTimes(1)

})


it('should write to an existing file', () => {
   destinations.single.send({
    message: 'Hello existing file. Works as expected.\n'
  })
  expect(spy).toHaveBeenCalledTimes(2)
})
