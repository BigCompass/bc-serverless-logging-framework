"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createLog_1 = require("../createLog");
let log;
beforeEach(() => {
    log = { message: 'test 123', level: 'info' };
});
it('does nothing if no props are provided', () => {
    createLog_1.applyDefaultProps(log);
    expect(log).toEqual({
        message: 'test 123',
        level: 'info'
    });
});
it('applies default props to log', () => {
    createLog_1.applyDefaultProps(log, {
        testprop: 'abc123',
        data: (log) => `message sent: ${log.message}`
    });
    expect(log).toEqual({
        message: 'test 123',
        level: 'info',
        testprop: 'abc123',
        data: 'message sent: test 123'
    });
});
it('does not apply a prop if it already is in the log object', () => {
    log.testprop = 'test prop 123';
    createLog_1.applyDefaultProps(log, { testprop: 'some other string' });
    expect(log).toEqual({
        message: 'test 123',
        level: 'info',
        testprop: 'test prop 123'
    });
});
