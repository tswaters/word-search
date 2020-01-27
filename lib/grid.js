// [name]: [xvector, yvector]
export const DIRECTIONS = {
  LTR: 1,
  LTR_UP: 2,
  LTR_DOWN: 3,
  RTL: 4,
  RTL_UP: 5,
  RTL_DOWN: 6,
  UP: 7,
  DOWN: 8
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
export const traverse = ({ board, xmax, index }) => {
  const move = movement({ xmax })

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

export const path = ({ board, xmax, index }) => {
  const t = traverse({ board, xmax, index })
  return direction => t(direction).map(index => board[index])
}

export const paths = ({ board, xmax, index }) => {
  const p = path({ board, xmax, index })
  return Object.entries(DIRECTIONS).reduce(
    (memo, [key, direction]) => ({
      ...memo,
      [DIRECTIONS[key]]: p(direction)
    }),
    {}
  )
}
