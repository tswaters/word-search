// [name]: [xvector, yvector]
export const DIRECTIONS = {
  LTR: 1,
  DIAG_UP: 2,
  DIAG_DOWN: 3,
  UP: 4,
  DOWN: 5
}

export const VECTORS = {
  [DIRECTIONS.LTR]: [1, 0],
  [DIRECTIONS.DIAG_UP]: [1, -1],
  [DIRECTIONS.DIAG_DOWN]: [1, 1],
  [DIRECTIONS.UP]: [0, -1],
  [DIRECTIONS.DOWN]: [0, 1]
}

// const x = ({ xmax }) => i => i % (xmax + 1)

// [name]: [xvector, yvector] => gridvector
export const movement = ({ xmax }) => ({
  [DIRECTIONS.LTR]: ([dx]) => dx,
  [DIRECTIONS.DIAG_UP]: ([dx, dy]) => (xmax + 1) * dy + dx,
  [DIRECTIONS.DIAG_DOWN]: ([dx, dy]) => (xmax + 1) * dy + dx,
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
    (dx <= 0 || index % (xmax + 1) < i % (xmax + 1))

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
      [key]: p(direction)
    }),
    {}
  )
}
