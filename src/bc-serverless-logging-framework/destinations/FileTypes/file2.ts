/**
 * Destination for sending logs to a file
 */

import * as fs from 'fs';
//import { writeFile } from 'fs';




const data = 'Hello!';

export const writer = async () => {
//  const fsPromises = {writeFile};

 const fsPromises = fs.promises;

 try {

  const file = await fsPromises.writeFile('file.txt', data);

}

  catch(err) {
    console.log('error occured:'+err);
  }

};

writer();


// const promise = fs.writeFile('file.txt', data)
