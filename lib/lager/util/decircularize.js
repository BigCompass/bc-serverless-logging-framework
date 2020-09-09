"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decircularize = void 0;
const json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
exports.decircularize = (obj) => JSON.parse(json_stringify_safe_1.default(obj));
