"use strict";
/**
 * Destination for sending logs to a file
 */
exports.__esModule = true;
var fs_1 = require("fs");
try {
    var data = new Uint8Array(Buffer.from('http.js'));
    var promise = fs_1.writeFile('file.txt', data, function (err) {
        if (err)
            throw err;
        console.log('The file has been saved!');
    });
}
catch (err) {
    console.error(err);
}
