export const N = 1 << 3
export const S = 1 << 2
export const E = 1 << 1
export const W = 1

export const CELL_STATE = {
  INVALID: 1 << 2,
  SELECTED: 1 << 1,
  FOUND: 1
}

export const prettyState = dir => {
  const vals = []
  if (dir & CELL_STATE.SELECTED) vals.push('selected')
  if (dir & CELL_STATE.FOUND) vals.push('found')
  if (dir & CELL_STATE.INVALID) vals.push('invalid')
  if (dir === 0) vals.push('none')
  return vals.join(', ')
}

export const prettyDir = dir => {
  const vals = []
  if (dir & E) vals.push('LTR')
  if (dir & W) vals.push('RTL')
  if (dir & N) vals.push('UP')
  if (dir & S) vals.push('DOWN')
  return vals.join('_')
}

// prettier-ignore
const ALL_DIRECTIONS = [
  E,
  E | N,
  E | S,
  W,
  W | N,
  W | S,
  N,
  S
]

export const DIRECTIONS = ALL_DIRECTIONS.reduce(
  (memo, item) => ({
    ...memo,
    [item]: item
  }),
  {}
)

const MOVEMENTS = {
  [E]: () => 1,
  [E | N]: xmax => -xmax + 1,
  [E | S]: xmax => xmax + 1,
  [W]: () => -1,
  [W | N]: xmax => -xmax - 1,
  [W | S]: xmax => xmax - 1,
  [N]: xmax => -xmax,
  [S]: xmax => xmax
}

export const x = ({ xmax, index }) => index % xmax

export const y = ({ xmax, index }) => Math.floor(index / xmax)

export const xy = opts => [x(opts), y(opts)]

export const vector = ({ xmax, start, end }) => {
  const [startX, startY] = xy({ xmax, index: start })
  const [currentX, currentY] = xy({ xmax, index: end })

  let direction =
    (startY > currentY ? N : 0) +
    (startY < currentY ? S : 0) +
    (startX < currentX ? E : 0) +
    (startX > currentX ? W : 0)

  const deltaX = Math.abs(currentX - startX)
  const deltaY = Math.abs(currentY - startY)
  const delta = Math.max(deltaX, deltaY)

  if (deltaY <= deltaX / 2) {
    if (direction & N) direction ^= N
    if (direction & S) direction ^= S
  }

  if (deltaX <= deltaY / 2) {
    if (direction & E) direction ^= E
    if (direction & W) direction ^= W
  }

  return [direction, delta]
}

export const between = ({ board, xmax, start, end }) => {
  const [direction, depth] = vector({ xmax, start, end })
  if (direction === 0) return []
  return path({ index: start, board, xmax, direction, depth })
}

export const path = ({ index, board, xmax, direction, depth = Infinity }) => {
  direction = parseInt(direction, 10) // keys are strings, sure we get ints for comparisons
  const move = MOVEMENTS[direction]
  const path = []
  let i = index
  const startX = x({ xmax, index })
  let currentX
  let n = 0
  do {
    path.push(board[i])
    i += move(xmax)
    currentX = x({ xmax, index: i })
    n += 1
  } while (
    n <= depth &&
    i >= 0 &&
    i < board.length &&
    (direction === N ||
      direction === S ||
      (direction & E && currentX > startX) ||
      (direction & W && currentX < startX))
  )
  if (path.length === 1) return []
  return path
}

export const paths = ({ index, board, xmax, dirs = MOVEMENTS }) =>
  Object.entries(dirs).reduce((memo, [direction]) => {
    const newPath = path({ index, board, xmax, direction })
    if (newPath.length > 0) memo.push(newPath)
    return memo
  }, [])

const pathToRegexp = path => {
  let any = 0
  return new RegExp(
    `^${path.reduce((memo, item, index) => {
      if (item.letter == null) {
        any += 1
      } else if (any) {
        memo += `.{${any}}` + item.letter
        any = 0
      } else {
        memo += item.letter
      }
      if (index === path.length - 1 && any) {
        memo += `.{0,${any}}`
      }
      return memo
    }, '')}$`
  )
}

export const populate = ({
  source = [],
  xmax,
  ymax,
  directions = [E, E | N, E | S, S],
  rnd,
  maxIterations = 1000,
  fill = false
}) => {
  const board = []
  const availablePaths = []
  const cellCount = xmax * ymax

  for (let index = 0; index < cellCount; index += 1) {
    board.push({
      letter: null,
      index,
      state: 0
    })
  }

  for (let index = 0; index < cellCount; index += 1) {
    for (let i = 0; i < directions.length; i += 1) {
      const newPath = path({
        index,
        board,
        xmax,
        direction: directions[i],
        depth: xmax
      })
      if (newPath.length > 0) {
        availablePaths.push(newPath)
      }
    }
  }

  const placedWords = []
  const placedLetters = []
  let minWordLength = Infinity

  const available = []
  for (let n = 0; n < source.length; n += 1) {
    if (source[n].length <= xmax) {
      available.push(source[n])
      minWordLength = Math.min(minWordLength, source[n].length)
    }
  }

  for (
    let n = 0;
    n < maxIterations && available.length > 0 && availablePaths.length > 0;
    n++
  ) {
    const pathIndex = rnd(0, availablePaths.length - 1)
    const chosenPath = availablePaths[pathIndex]
    const rx = pathToRegexp(chosenPath)
    const matchingWords = available.filter(x => rx.test(x))
    if (matchingWords.length === 0) {
      availablePaths.splice(pathIndex, 1)
      continue
    }

    const wordIndex = rnd(0, matchingWords.length - 1)
    const chosenWord = matchingWords[wordIndex]
    placedWords.push(chosenWord)
    placedLetters.push(...chosenWord)
    chosenPath.forEach((cell, index) => (cell.letter = chosenWord[index]))
    available.splice(available.indexOf(chosenWord), 1)
    availablePaths.splice(pathIndex, 1)
  }

  // shouldn't happen, but if no words chosen placedLetters is []
  // make sure to at least populate with random distribution of letters.
  if (placedLetters.length === 0) {
    placedLetters.push(
      ...new Array(26)
        .fill(null)
        .map((x, index) => String.fromCharCode(index + 97))
    )
  }

  for (let x = 0; fill && x < board.length; x += 1) {
    if (board[x].letter) continue
    board[x].letter = placedLetters[rnd(0, placedLetters.length - 1)]
  }

  placedWords.sort()

  return { board, placedWords }
}
