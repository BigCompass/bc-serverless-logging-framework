import * as fs from 'fs';

const data = "Hello";


fs.writeFile('./newFile.txt', data, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('File created successfully');
  }
});
