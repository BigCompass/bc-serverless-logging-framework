"use strict";
exports.__esModule = true;
exports.decircularize = void 0;
var json_stringify_safe_1 = require("json-stringify-safe");
var decircularize = function (obj) { return JSON.parse(json_stringify_safe_1["default"](obj)); };
exports.decircularize = decircularize;
