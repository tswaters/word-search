import assert from 'assert'
import { random } from '../lib/random'
import { populate } from '../lib/grid'

const sizes = {
  '5x5': {
    xmax: 5,
    ymax: 5,
    source: ['foo', 'bar', 'baz', 'qux'],
    rnd: random(3)
  }
}

describe('populate', () =>
  Object.entries(sizes).forEach(([size, opts]) =>
    it(size, () => {
      const { placedWords, board } = populate(opts)
      assert.deepEqual(
        board.map(x => (x.letter ? x.letter : ' ')),
        // prettier-ignore
        [
          ' ', 'b', 'f', ' ', ' ',
          'q', ' ', 'a', 'o', ' ',
          ' ', 'u', 'b', 'r', 'o',
          ' ', ' ', 'x', 'a', ' ',
          ' ', ' ', ' ', ' ', 'z'
        ]
      )
      assert.deepEqual(Object.keys(placedWords).sort(), opts.source.sort())
    })
  ))
