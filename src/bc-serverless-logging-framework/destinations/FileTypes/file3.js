"use strict";
exports.__esModule = true;
var fs = require("fs");
var data = "Hello World";
fs.writeFile('./newFile.txt', data, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log('File created successfully');
    }
});
