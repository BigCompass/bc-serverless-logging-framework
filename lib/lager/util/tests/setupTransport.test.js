"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = require("../transport");
const constants_1 = require("../../constants");
const testLevels = ['test_level_1', 'test_level_2', 'test_level_3'];
it('sets the level number correctly', () => {
    testLevels.forEach((level, i) => {
        const transport = {
            level
        };
        expect(transport_1.setupTransport(transport, testLevels)).toEqual({
            level,
            levelNumber: i
        });
    });
});
it('sets levelNumber to TRANSPORT_LEVEL_ALL if the transport does not specify a level', () => { });
it('sets levelNumber to TRANSPORT_LEVEL_ALL for appropriate scenarios', () => {
    // transport does not specify a level
    expect(transport_1.setupTransport({}, testLevels)).toEqual({
        levelNumber: constants_1.TRANSPORT_LEVEL_ALL
    });
    // no levels provided
    expect(transport_1.setupTransport({ level: 'test_level_2' }, undefined)).toEqual({
        level: 'test_level_2',
        levelNumber: constants_1.TRANSPORT_LEVEL_ALL
    });
    expect(transport_1.setupTransport({ level: 'test_level_2' }, [])).toEqual({
        level: 'test_level_2',
        levelNumber: constants_1.TRANSPORT_LEVEL_ALL
    });
    // Transport specifies level not in levels array
    expect(transport_1.setupTransport({ level: 'test_level_4' }, testLevels)).toEqual({
        level: 'test_level_4',
        levelNumber: constants_1.TRANSPORT_LEVEL_ALL
    });
});
