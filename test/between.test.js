import assert from 'assert'
import { between } from '../lib/grid'

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
