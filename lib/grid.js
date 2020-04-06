export const N = 1 << 3
export const S = 1 << 2
export const E = 1 << 1
export const W = 1

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

export const x = (xmax, index) => index % xmax

export const y = (xmax, index) => Math.floor(index / xmax)

export const xy = (...opts) => [x(...opts), y(...opts)]

export const vector = ({ xmax, start, end }) => {
  const [startX, startY] = xy(xmax, start)
  const [currentX, currentY] = xy(xmax, end)

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

export const range = (
  { board, xmax, selection: { startIndex, endIndex } },
  populate = true
) => {
  const [direction, depth] = vector({ xmax, start: startIndex, end: endIndex })
  if (direction === 0) return []
  return path({ index: startIndex, board, xmax, direction, depth, populate })
}

export const between = ({ board, xmax, start, end }, populate = false) => {
  const [direction, depth] = vector({ xmax, start, end })
  if (direction === 0) return []

  const cells = path({ board, index: start, xmax, direction, depth, populate })
  if (cells.length < 1) return []

  const first = cells[0]
  const last = cells[cells.length - 1]
  return [first, last]
}

export const path = ({
  index,
  board,
  xmax,
  direction,
  depth = Infinity,
  populate
}) => {
  direction = parseInt(direction, 10) // keys are strings, sure we get ints for comparisons
  const move = MOVEMENTS[direction]
  const path = []
  let i = index
  const startX = x(xmax, index)
  let currentX
  let n = 0
  do {
    path.push(populate ? board[i] : i)
    i += move(xmax)
    currentX = x(xmax, i)
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

const pathToRegexp = path => {
  let any = 0
  return new RegExp(
    `^${path.reduce((memo, letter, index) => {
      if (letter == null) {
        any += 1
      } else if (any) {
        memo += `.{${any}}` + letter
        any = 0
      } else {
        memo += letter
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
  directions = [E, E | S, S],
  rnd,
  MAX = 1000,
  fill = false
}) => {
  const board = []
  const paths = []
  const cellCount = xmax * ymax

  for (let index = 0; index < cellCount; index += 1) {
    board.push(null)
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
        paths.push(newPath)
      }
    }
  }

  const placed = {}
  const placedLetters = []
  let minWordLength = Infinity

  const words = []
  for (let n = 0; n < source.length; n += 1) {
    if (source[n].length <= Math.min(xmax, ymax)) {
      words.push(source[n])
      minWordLength = Math.min(minWordLength, source[n].length)
    }
  }

  for (let n = 0; n < MAX && words.length > 0 && paths.length > 0; n++) {
    const [chosenPath] = paths.splice(rnd(0, paths.length - 1), 1)
    const rx = pathToRegexp(chosenPath.map(index => board[index]))

    const wordIndexes = words.reduce((acc, word, index) => {
      if (rx.test(word)) acc.push(index)
      return acc
    }, [])

    if (wordIndexes.length === 0) continue

    const [word] = words.splice(wordIndexes[rnd(0, wordIndexes.length - 1)], 1)
    placed[word] = {
      startIndex: chosenPath[0],
      endIndex: chosenPath[word.length - 1]
    }

    for (let i = 0; i < word.length; i += 1) {
      placedLetters.push(word[i])
      board[chosenPath[i]] = word[i]
    }
  }

  // shouldn't happen, but if no words chosen placedLetters is []
  // make sure to at least populate with random distribution of letters.
  if (placedLetters.length === 0) {
    placedLetters.push(
      ...new Array(26)
        .fill(null)
        .map((_, index) => String.fromCharCode(index + 97))
    )
  }

  for (let x = 0; fill && x < board.length; x += 1) {
    if (board[x]) continue
    board[x] = placedLetters[rnd(0, placedLetters.length - 1)]
  }

  return { board, placed }
}
