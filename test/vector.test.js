import assert from 'assert'
import { vector, N, S, E, W, prettyDir } from '../lib/grid'

describe('get cells from start/current', () => {
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
        { start: 0, end: 4, actual: [E, 4] }, // right
        { start: 0, end: 20, actual: [S, 4] }, // down
        { start: 0, end: 21, actual: [S, 4] }, // down, a bit right
        { start: 0, end: 9, actual: [E, 4] }, // right, a bit down
        { start: 4, end: 0, actual: [W, 4] }, // left
        { start: 20, end: 19, actual: [E, 4] }, // right, a bit up
        { start: 24, end: 4, actual: [N, 4] }, // up
        { start: 24, end: 3, actual: [N, 4] }, // up, a bit left
      ],
    },
  ]

  tests.forEach(({ xmax, specs }) => {
    describe(`xmax: ${xmax}`, () => {
      specs.forEach(({ start, end, actual: [direction, delta] }) => {
        const dir = prettyDir(direction)
        it(`index: ${start} -> ${end} == ${dir} {${delta}}`, () => {
          assert.deepEqual(vector({ xmax, start, end }), [direction, delta])
        })
      })
    })
  })
})
