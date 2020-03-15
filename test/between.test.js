import assert from 'assert'
import { between } from '../lib/grid'

/*

        { index: 0, actual: [0, 0] }, // top-left
        { index: 4, actual: [4, 0] }, // top-right
        { index: 12, actual: [2, 2] }, // middle
        { index: 20, actual: [0, 4] }, // bottom-left
        { index: 24, actual: [4, 4] } // bottom-right
*/

describe('between', () => {
  const tests = [
    {
      xmax: 4,
      // prettier-ignore
      board: [
        'a', 'b', 'c', 'd', 'e',
        'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y'
      ],
      specs: [
        { start: 0, end: 4, actual: ['a', 'b', 'c', 'd', 'e'] },
        { start: 4, end: 0, actual: ['e', 'd', 'c', 'b', 'a'] },
        { start: 0, end: 20, actual: ['a', 'f', 'k', 'p', 'u'] },
        { start: 0, end: 24, actual: ['a', 'g', 'm', 's', 'y'] },
        { start: 0, end: 1, actual: ['a', 'b'] },
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
