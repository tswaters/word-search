import assert from 'assert'
import { x, y, xy } from '../lib/grid'

describe('x/y', () => {
  const tests = [
    {
      xmax: 5,
      /*
        'a', 'b', 'c', 'd', 'e',
        'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y'
      */
      specs: [
        { index: 0, actual: [0, 0] }, // top-left
        { index: 4, actual: [4, 0] }, // top-right
        { index: 12, actual: [2, 2] }, // middle
        { index: 20, actual: [0, 4] }, // bottom-left
        { index: 24, actual: [4, 4] } // bottom-right
      ]
    }
  ]
  tests.forEach(({ xmax, specs }) => {
    describe(`xmax: ${xmax}`, () => {
      specs.forEach(({ index, actual }) => {
        it(`index: ${index}`, () => {
          assert.equal(x(xmax, index), actual[0])
          assert.equal(y(xmax, index), actual[1])
          assert.deepEqual(xy(xmax, index), actual)
        })
      })
    })
  })
})
