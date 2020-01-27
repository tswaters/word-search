import assert from 'assert'
import { path, paths, DIRECTIONS } from '../lib/grid'

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
          [DIRECTIONS.LTR_DOWN]: ['a', 'e', 'i'],
          [DIRECTIONS.LTR_UP]: [],
          [DIRECTIONS.DOWN]: ['a', 'd', 'g'],
          [DIRECTIONS.UP]: []
        }
      },
      'index 11 - middle - all paths': {
        index: 4,
        usePaths: true,
        actual: {
          [DIRECTIONS.LTR]: ['e', 'f'],
          [DIRECTIONS.LTR_DOWN]: ['e', 'i'],
          [DIRECTIONS.LTR_UP]: ['e', 'c'],
          [DIRECTIONS.RTL]: ['e', 'd'],
          [DIRECTIONS.RTL_DOWN]: ['e', 'g'],
          [DIRECTIONS.RTL_UP]: ['e', 'a'],
          [DIRECTIONS.DOWN]: ['e', 'h'],
          [DIRECTIONS.UP]: ['e', 'b']
        }
      },
      'index: 2 - top-right': {
        index: 2,
        actual: {
          [DIRECTIONS.LTR]: [],
          [DIRECTIONS.LTR_DOWN]: [],
          [DIRECTIONS.LTR_UP]: [],
          [DIRECTIONS.DOWN]: ['c', 'f', 'i'],
          [DIRECTIONS.UP]: []
        }
      },
      'index: 4 - middle': {
        index: 4,
        actual: {
          [DIRECTIONS.LTR]: ['e', 'f'],
          [DIRECTIONS.LTR_DOWN]: ['e', 'i'],
          [DIRECTIONS.LTR_UP]: ['e', 'c'],
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
      'index 0 - top-left': {
        index: 0,
        actual: {
          [DIRECTIONS.LTR_DOWN]: ['a', 'g', 'm', 's', 'y']
        }
      },
      'index 11 - middle - all paths': {
        index: 12,
        usePaths: true,
        actual: {
          [DIRECTIONS.LTR]: ['m', 'n', 'o'],
          [DIRECTIONS.LTR_DOWN]: ['m', 's', 'y'],
          [DIRECTIONS.LTR_UP]: ['m', 'i', 'e'],
          [DIRECTIONS.RTL]: ['m', 'l', 'k'],
          [DIRECTIONS.RTL_DOWN]: ['m', 'q', 'u'],
          [DIRECTIONS.RTL_UP]: ['m', 'g', 'a'],
          [DIRECTIONS.DOWN]: ['m', 'r', 'w'],
          [DIRECTIONS.UP]: ['m', 'h', 'c']
        }
      },

      'index 20 - bottom left': {
        index: 20,
        actual: {
          [DIRECTIONS.LTR_UP]: ['u', 'q', 'm', 'i', 'e']
        }
      }
    }
  }
}

describe('grid', () =>
  Object.entries(sizes).forEach(([size, { xmax, board, specs }]) =>
    describe(size, () =>
      Object.entries(specs).forEach(([name, { index, actual, usePaths }]) =>
        describe(name, () =>
          usePaths
            ? it('paths', () =>
                assert.deepEqual(paths({ board, xmax })(index), actual))
            : Object.entries(DIRECTIONS).forEach(
                ([key, direction]) =>
                  actual[direction] &&
                  it(key, () =>
                    assert.deepEqual(
                      path({ board, xmax })(index)(direction),
                      actual[direction]
                    )
                  )
              )
        )
      )
    )
  ))
