export const DIRECTIONS = {
  LTR: () => 1,
  LTR_UP: xmax => -(xmax + 1) + 1,
  LTR_DOWN: xmax => xmax + 2,
  RTL: () => -1,
  RTL_UP: xmax => -(xmax + 1) - 1,
  RTL_DOWN: xmax => xmax,
  UP: xmax => -(xmax + 1),
  DOWN: xmax => xmax + 1
}

export const paths = ({ index, board, xmax, dirs = DIRECTIONS }) =>
  Object.entries(dirs).reduce((memo, [key, move]) => {
    const acc = []
    const left = /LTR/.test(key)
    const right = /RTL/.test(key)
    const vertical = ['UP', 'DOWN'].includes(key)
    let i = index
    const orig = i % (xmax + 1)
    let x
    do {
      acc.push(board[i])
      i += move(xmax)
      x = i % (xmax + 1)
    } while (
      i >= 0 &&
      i < board.length &&
      (vertical || (left && x > orig) || (right && x < orig))
    )
    if (acc.length === 1) return memo
    memo.push(acc)
    return memo
  }, [])
