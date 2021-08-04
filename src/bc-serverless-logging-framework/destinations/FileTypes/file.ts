/**
 * Destination for sending logs to a file
 */

 import { writeFile } from 'fs';

try {

 const data = new Uint8Array(Buffer.from('http.js'));
 const promise = writeFile('file.txt', data, (err) => {
   if (err) throw err;
   console.log('The file has been saved!');
 });



} catch (err) {
  console.error(err);
}
