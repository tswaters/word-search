import assert from 'assert'
import { path, DIRECTIONS } from '../lib/grid'

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
        actual: {
          [DIRECTIONS.LTR]: ['a', 'b', 'c'],
          [DIRECTIONS.DIAG_DOWN]: ['a', 'e', 'i'],
          [DIRECTIONS.DIAG_UP]: [],
          [DIRECTIONS.DOWN]: ['a', 'd', 'g'],
          [DIRECTIONS.UP]: []
        }
      },
      'index: 2 - top-right': {
        index: 2,
        actual: {
          [DIRECTIONS.LTR]: [],
          [DIRECTIONS.DIAG_DOWN]: [],
          [DIRECTIONS.DIAG_UP]: [],
          [DIRECTIONS.DOWN]: ['c', 'f', 'i'],
          [DIRECTIONS.UP]: []
        }
      },
      'index: 4 - middle': {
        index: 4,
        actual: {
          [DIRECTIONS.LTR]: ['e', 'f'],
          [DIRECTIONS.DIAG_DOWN]: ['e', 'i'],
          [DIRECTIONS.DIAG_UP]: ['e', 'c'],
          [DIRECTIONS.DOWN]: ['e', 'h'],
          [DIRECTIONS.UP]: ['e', 'b']
        }
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
      'index 0 - center': {
        index: 0,
        actual: {
          [DIRECTIONS.DIAG_DOWN]: ['a', 'g', 'm', 's', 'y']
        }
      },
      'index 11 - middle': {
        index: 12,
        actual: {
          [DIRECTIONS.LTR]: ['m', 'n', 'o']
        }
      },

      'index 20 - bottom left': {
        index: 20,
        actual: {
          [DIRECTIONS.DIAG_UP]: ['u', 'q', 'm', 'i', 'e']
        }
      }
    }
  }
}

describe('grid', () =>
  Object.entries(sizes).forEach(([size, { xmax, board, specs }]) =>
    describe(size, () =>
      Object.entries(specs).forEach(([name, { index, actual }]) =>
        describe(name, () =>
          Object.entries(DIRECTIONS).forEach(
            ([key, direction]) =>
              actual[direction] &&
              it(key, () =>
                assert.deepEqual(
                  path({ board, xmax, index })(direction),
                  actual[direction]
                )
              )
          )
        )
      )
    )
  ))
