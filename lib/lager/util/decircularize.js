"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decircularize = void 0;
const flatted_1 = require("flatted");
exports.decircularize = (obj) => flatted_1.parse(flatted_1.stringify(obj));
