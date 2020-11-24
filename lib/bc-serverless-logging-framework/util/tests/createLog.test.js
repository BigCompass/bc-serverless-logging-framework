"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("../createLog"));
// setup spies/mocks
const mockData = {
    level: 'info',
    args: ['test message'],
    logProps: { test: 'test123' },
    computed: {},
    errorKey: 'error',
    log: { message: '123' }
};
const spies = {
    initLog: jest.spyOn(util, 'initLog').mockReturnValue(mockData.log),
    applyDefaultProps: jest
        .spyOn(util, 'applyDefaultProps')
        .mockImplementation((log) => {
        log.testChange = true;
        return log;
    })
};
// Reset spies/mock data for each test
beforeEach(() => {
    Object.values(spies).forEach((spy) => spy.mockClear());
    mockData.log = { message: '123' };
});
it('calls helper functions as expected and returns log object', () => {
    const log = util.createLog(mockData.level, mockData.args, mockData.logProps, mockData.computed, undefined, // propsRoot
    mockData.errorKey);
    expect(spies.initLog).toHaveBeenCalledWith(...[mockData.level, mockData.args, mockData.errorKey]);
    expect(log).toBeDefined();
});
