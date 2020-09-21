"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = require("../transport");
const handlers = {
    handler1: () => null,
    handler2: () => null,
    handler3: () => null
};
const testLog = {
    level: 'test',
    message: 'test message'
};
const spies = {
    handler1: jest.spyOn(handlers, 'handler1'),
    handler2: jest.spyOn(handlers, 'handler2'),
    handler3: jest.spyOn(handlers, 'handler3'),
    consoleWarning: jest.spyOn(console, 'warn').mockReturnValue()
};
const clearSpies = () => Object.values(spies).forEach((spy) => spy.mockClear());
let transports;
beforeEach(() => {
    transports = [
        {
            handler: handlers.handler1
        },
        {
            handler: handlers.handler2
        },
        {
            levelNumber: 3,
            handler: handlers.handler3
        }
    ];
    clearSpies();
});
it('Runs transport at specified levels only', () => {
    transport_1.runTransports(testLog, 1, transports);
    expect(spies.handler1).toHaveBeenCalled();
    expect(spies.handler2).toHaveBeenCalled();
    expect(spies.handler3).not.toHaveBeenCalled();
    clearSpies();
    transport_1.runTransports(testLog, 4, transports);
    expect(spies.handler1).toHaveBeenCalled();
    expect(spies.handler2).toHaveBeenCalled();
    expect(spies.handler3).toHaveBeenCalled();
    clearSpies();
});
it('Runs transport if levelNumber not specified', () => {
    transport_1.runTransports(testLog, undefined, transports);
    expect(spies.handler1).toHaveBeenCalled();
    expect(spies.handler2).toHaveBeenCalled();
    expect(spies.handler3).toHaveBeenCalled();
});
it('Returns promises for any transports that result in promises', () => __awaiter(void 0, void 0, void 0, function* () {
    spies.handler1.mockReturnValueOnce(Promise.resolve('handler1_result'));
    spies.handler2.mockReturnValueOnce(Promise.resolve('handler2_result'));
    const results = transport_1.runTransports(testLog, 0, transports);
    expect(results.length).toBe(2);
    const promiseResults = yield Promise.all(results);
    expect(promiseResults).toEqual(['handler1_result', 'handler2_result']);
}));
it('logs a warning if a transport does not have a destination or handler', () => {
    // Add a transport without a destination or handler
    transports.push({});
    // Run transports
    transport_1.runTransports(testLog, 0, transports);
    // Check that warning was logged for bad transport
    expect(spies.consoleWarning).toHaveBeenCalledWith(`Invalid Lager transport: {}. Skipping log`);
});
it('runs a destination send() function as expected', () => {
    const testDestination = {
        send: () => undefined
    };
    const destinationSpy = jest.spyOn(testDestination, 'send');
    transports.push({ destination: testDestination });
    transport_1.runTransports(testLog, 0, transports);
    expect(destinationSpy).toHaveBeenCalledWith(testLog);
});
