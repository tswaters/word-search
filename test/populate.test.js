import assert from 'assert'
import { random } from '../lib/random'
import { populate } from '../lib/grid'

const sizes = {
  '5x5': {
    xmax: 4,
    ymax: 4,
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
          ' ', 'f', ' ', ' ', ' ',
          'b', 'o', 'b', ' ', ' ',
          'a', 'o', 'x', 'a', ' ',
          'r', 'u', ' ', ' ', 'z',
          'q', ' ', ' ', ' ', ' '
        ]
      )
      assert.deepEqual(placedWords.sort(), opts.source.sort())
    })
  ))
