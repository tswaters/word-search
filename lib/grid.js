// [name]: [xvector, yvector]
export const DIRECTIONS = {
  LTR: 'LTR',
  LTR_UP: 'LTR_UP',
  LTR_DOWN: 'LTR_DOWN',
  RTL: 'RTL',
  RTL_UP: 'RTL_UP',
  RTL_DOWN: 'RTL_DOWN',
  UP: 'UP',
  DOWN: 'DOWN'
}

export const VECTORS = {
  [DIRECTIONS.LTR]: [1, 0],
  [DIRECTIONS.LTR_UP]: [1, -1],
  [DIRECTIONS.LTR_DOWN]: [1, 1],
  [DIRECTIONS.RTL]: [-1, 0],
  [DIRECTIONS.RTL_UP]: [-1, -1],
  [DIRECTIONS.RTL_DOWN]: [-1, 1],
  [DIRECTIONS.UP]: [0, -1],
  [DIRECTIONS.DOWN]: [0, 1]
}

// const x = ({ xmax }) => i => i % (xmax + 1)

// [name]: [xvector, yvector] => gridvector
export const movement = ({ xmax }) => ({
  [DIRECTIONS.LTR]: ([dx]) => dx,
  [DIRECTIONS.LTR_UP]: ([dx, dy]) => (xmax + 1) * dy + dx,
  [DIRECTIONS.LTR_DOWN]: ([dx, dy]) => (xmax + 1) * dy + dx,
  [DIRECTIONS.RTL]: ([dx]) => dx,
  [DIRECTIONS.RTL_UP]: ([dx, dy]) => (xmax + 1) * dy + dx,
  [DIRECTIONS.RTL_DOWN]: ([dx, dy]) => (xmax + 1) * dy + dx,
  [DIRECTIONS.UP]: ([, dy]) => (xmax + 1) * dy,
  [DIRECTIONS.DOWN]: ([, dy]) => (xmax + 1) * dy
})

// return nodes in a given direction, stopping when we'd go off the grid
// only deal with indexes & xmax; so take the given xvector and compare
// between original node's index and mine. if it wraps over to the other
// side, that's a no-go. y is a bit easier !(< 0 && > len)
export const traverse = ({ board, xmax }) => {
  const move = movement({ xmax })

  return index => {
    const keep_going = (i, [dx]) =>
      i >= 0 &&
      i < board.length &&
      (dx === 0 ||
        (dx > 0 && index % (xmax + 1) < i % (xmax + 1)) ||
        (dx < 0 && index % (xmax + 1) > i % (xmax + 1)))

    return direction => {
      const vector = VECTORS[direction]
      const acc = []
      let i = index
      do {
        acc.push(i)
        i += move[direction](vector)
      } while (keep_going(i, vector))
      if (acc.length === 1) return []
      return acc
    }
  }
}

export const path = ({ board, xmax }) => {
  const t1 = traverse({ board, xmax })
  return index => {
    const t2 = t1(index)
    return direction => t2(direction).map(index => board[index])
  }
}

export const paths = ({ board, xmax }, dirs = Object.entries(DIRECTIONS)) => {
  const p1 = path({ board, xmax })
  return index => {
    const p2 = p1(index)
    return dirs.reduce(
      (memo, [key, direction]) => ({
        ...memo,
        [DIRECTIONS[key]]: p2(direction)
      }),
      {}
    )
  }
}
