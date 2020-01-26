import assert from 'assert'
import { random } from '../lib/random'

describe('random', () => {
  it('does the same thing over and over', () => {
    const rnd = random(4)
    assert.equal(rnd(42, 63), 42)
    assert.equal(rnd(42, 63), 49)
    assert.equal(rnd(42, 63), 50)
    assert.equal(rnd(42, 63), 60)
    assert.equal(rnd(42, 63), 62)
    assert.equal(rnd(42, 63), 56)
    assert.equal(rnd(42, 63), 45)
    assert.equal(rnd(42, 63), 51)
    assert.equal(rnd(42, 63), 47)
  })
})
