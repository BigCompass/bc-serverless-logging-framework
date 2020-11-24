"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decircularize_1 = require("../decircularize");
it('decircularizes an object that references itself', () => {
    const obj = { a: 1, b: 2, selfRef: {} };
    obj.selfRef = obj;
    const result = decircularize_1.decircularize(obj);
    expect(result).toEqual({
        a: 1,
        b: 2,
        selfRef: '[Circular ~]'
    });
});
