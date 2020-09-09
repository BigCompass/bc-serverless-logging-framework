import { setupTransport } from '../transport'
import { TRANSPORT_LEVEL_ALL } from '../../constants'

const testLevels = ['test_level_1', 'test_level_2', 'test_level_3']

it('sets the level number correctly', () => {
  testLevels.forEach((level, i) => {
    const transport = {
      level
    }
    expect(setupTransport(transport, testLevels)).toEqual({
      level,
      levelNumber: i
    })
  })
})

it('sets levelNumber to TRANSPORT_LEVEL_ALL if the transport does not specify a level', () => { })

it('sets levelNumber to TRANSPORT_LEVEL_ALL for appropriate scenarios', () => {
  // transport does not specify a level
  expect(setupTransport({}, testLevels)).toEqual({
    levelNumber: TRANSPORT_LEVEL_ALL
  })

  // no levels provided
  expect(setupTransport({ level: 'test_level_2' }, undefined)).toEqual({
    level: 'test_level_2',
    levelNumber: TRANSPORT_LEVEL_ALL
  })
  expect(setupTransport({ level: 'test_level_2' }, [])).toEqual({
    level: 'test_level_2',
    levelNumber: TRANSPORT_LEVEL_ALL
  })

  // Transport specifies level not in levels array
  expect(setupTransport({ level: 'test_level_4' }, testLevels)).toEqual({
    level: 'test_level_4',
    levelNumber: TRANSPORT_LEVEL_ALL
  })
})
