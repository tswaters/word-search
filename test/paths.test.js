import assert from 'assert'
import { paths } from '../lib/grid'

const sizes = {
  '3x3': {
    xmax: 2,
    // prettier-ignore
    board: [
      'a', 'b', 'c',
      'd', 'e', 'f',
      'g', 'h', 'i'
    ],
    specs: {
      'index: 0 - top left': {
        index: 0,
        actual: [
          ['a', 'b', 'c'],
          ['a', 'e', 'i'],
          ['a', 'd', 'g']
        ]
      },
      'index 4 - middle': {
        index: 4,
        actual: [
          ['e', 'f'],
          ['e', 'c'],
          ['e', 'i'],
          ['e', 'd'],
          ['e', 'a'],
          ['e', 'g'],
          ['e', 'b'],
          ['e', 'h']
        ]
      },
      'index: 2 - top-right': {
        index: 2,
        actual: [
          ['c', 'b', 'a'],
          ['c', 'e', 'g'],
          ['c', 'f', 'i']
        ]
      },
      'index: 4 - middle': {
        index: 4,
        actual: [
          ['e', 'f'],
          ['e', 'c'],
          ['e', 'i'],
          ['e', 'd'],
          ['e', 'a'],
          ['e', 'g'],
          ['e', 'b'],
          ['e', 'h']
        ]
      }
    }
  },
  '5x5': {
    xmax: 4,
    // prettier-ignore
    board: [
      'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't',
      'u', 'v', 'w', 'x', 'y'
    ],
    specs: {
      'index 0 - top-left': {
        index: 0,
        actual: [
          ['a', 'b', 'c', 'd', 'e'],
          ['a', 'g', 'm', 's', 'y'],
          ['a', 'f', 'k', 'p', 'u']
        ]
      },
      'index 11 - middle - all paths': {
        index: 12,
        actual: [
          ['m', 'n', 'o'],
          ['m', 'i', 'e'],
          ['m', 's', 'y'],
          ['m', 'l', 'k'],
          ['m', 'g', 'a'],
          ['m', 'q', 'u'],
          ['m', 'h', 'c'],
          ['m', 'r', 'w']
        ]
      },

      'index 20 - bottom left': {
        index: 20,
        actual: [
          ['u', 'v', 'w', 'x', 'y'],
          ['u', 'q', 'm', 'i', 'e'],
          ['u', 'p', 'k', 'f', 'a']
        ]
      }
    }
  }
}

describe('grid', () =>
  Object.entries(sizes).forEach(([size, { xmax, board, specs }]) =>
    describe(size, () =>
      Object.entries(specs).forEach(([name, { index, actual }]) =>
        it(name, () => assert.deepEqual(paths({ board, xmax, index }), actual))
      )
    )
  ))
