import assert from 'assert'
import { N, S, E, W, path, prettyDir } from '../lib/grid'

const sizes = {
  '3x3': {
    xmax: 3,
    // prettier-ignore
    board: [
      'a', 'b', 'c',
      'd', 'e', 'f',
      'g', 'h', 'i'
    ],
    specs: {
      'index: 0 - top left': {
        index: 0,
        directions: [E, S, S | E],
        actual: [
          ['a', 'b', 'c'],
          ['a', 'd', 'g'],
          ['a', 'e', 'i']
        ]
      },
      'index: 6 - bottom left': {
        index: 6,
        directions: [E, N, N | E],
        actual: [
          ['g', 'h', 'i'],
          ['g', 'd', 'a'],
          ['g', 'e', 'c']
        ]
      },
      'index 4 - middle': {
        index: 4,
        // prettier-ignore
        directions: [
          W,
          E,
          S,
          S | W,
          S | E,
          N,
          N | W,
          N | E
        ],
        actual: [
          ['e', 'd'],
          ['e', 'f'],
          ['e', 'h'],
          ['e', 'g'],
          ['e', 'i'],
          ['e', 'b'],
          ['e', 'a'],
          ['e', 'c']
        ]
      },
      'index: 2 - top-right': {
        index: 2,
        directions: [W, S, W | S],
        actual: [
          ['c', 'b', 'a'],
          ['c', 'f', 'i'],
          ['c', 'e', 'g']
        ]
      },
      'index: 4 - middle': {
        index: 4,
        // prettier-ignore
        directions: [
          W,
          E,
          S,
          S | W,
          S | E,
          N,
          N | W,
          N | E
        ],
        actual: [
          ['e', 'd'],
          ['e', 'f'],
          ['e', 'h'],
          ['e', 'g'],
          ['e', 'i'],
          ['e', 'b'],
          ['e', 'a'],
          ['e', 'c']
        ]
      }
    }
  },
  '5x5': {
    xmax: 5,
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
        directions: [E, S, S | E],
        actual: [
          ['a', 'b', 'c', 'd', 'e'],
          ['a', 'f', 'k', 'p', 'u'],
          ['a', 'g', 'm', 's', 'y']
        ]
      },
      'index 11 - middle - all paths': {
        index: 12,
        // prettier-ignore
        directions: [
          W,
          E,
          S,
          S | W,
          S | E,
          N,
          N | W,
          N | E
        ],
        actual: [
          ['m', 'l', 'k'],
          ['m', 'n', 'o'],
          ['m', 'r', 'w'],
          ['m', 'q', 'u'],
          ['m', 's', 'y'],
          ['m', 'h', 'c'],
          ['m', 'g', 'a'],
          ['m', 'i', 'e']
        ]
      },
      'index 20 - bottom left': {
        index: 20,
        directions: [E, N, N | E],
        actual: [
          ['u', 'v', 'w', 'x', 'y'],
          ['u', 'p', 'k', 'f', 'a'],
          ['u', 'q', 'm', 'i', 'e']
        ]
      }
    }
  }
}

describe('path', () =>
  Object.entries(sizes).forEach(([size, { xmax, board, specs }]) =>
    describe(size, () =>
      Object.entries(specs).forEach(([name, { index, actual, directions }]) =>
        describe(name, () =>
          directions.forEach((direction, dirIndex) =>
            it(prettyDir(direction), () =>
              assert.deepEqual(
                path({ board, xmax, index, direction }),
                actual[dirIndex]
              )
            )
          )
        )
      )
    )
  ))
