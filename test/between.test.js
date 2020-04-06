import assert from 'assert'
import { between } from '../lib/grid'

// prettier-ignore
const board = [
  'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y'
]

describe('between', () => {
  const tests = [
    {
      xmax: 5,
      board,
      specs: [
        { start: 0, end: 4, actual: [board.indexOf('a'), board.indexOf('e')] },
        { start: 4, end: 0, actual: [board.indexOf('e'), board.indexOf('a')] },
        { start: 0, end: 20, actual: [board.indexOf('a'), board.indexOf('u')] },
        { start: 0, end: 24, actual: [board.indexOf('a'), board.indexOf('y')] },
        { start: 0, end: 1, actual: [board.indexOf('a'), board.indexOf('b')] },
        { start: 0, end: 0, actual: [] }
      ]
    }
  ]
  tests.forEach(({ xmax, board, specs }) => {
    describe(`xmax: ${xmax}`, () => {
      specs.forEach(({ start, end, actual }) => {
        it(`${start} -> ${end}`, () => {
          assert.deepEqual(between({ board, xmax, start, end }), actual)
        })
      })
    })
  })
})
