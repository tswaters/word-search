export const N = 0b1000
export const S = 0b0100
export const E = 0b0010
export const W = 0b0001

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
  [E | N]: xmax => -(xmax + 1) + 1,
  [E | S]: xmax => xmax + 2,
  [W]: () => -1,
  [W | N]: xmax => -(xmax + 1) - 1,
  [W | S]: xmax => xmax,
  [N]: xmax => -(xmax + 1),
  [S]: xmax => xmax + 1
}

export const path = ({ index, board, xmax, direction, depth = Infinity }) => {
  direction = parseInt(direction, 10) // keys are strings, sure we get ints for comparisons
  const move = MOVEMENTS[direction]
  const path = []
  let i = index
  const orig = i % (xmax + 1)
  let x
  let n = 0
  do {
    path.push(board[i])
    i += move(xmax)
    x = i % (xmax + 1)
    n += 1
  } while (
    n <= depth &&
    i >= 0 &&
    i < board.length &&
    (direction === N ||
      direction === S ||
      (direction & E && x > orig) ||
      (direction & W && x < orig))
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
  const board = Array((xmax + 1) * (ymax + 1))
    .fill(null)
    .map((_, index) => ({ index, letter: null }))

  const placedWords = []
  const placedLetters = []
  let minWordLength = Infinity

  const available = []
  for (let n = 0; n < source.length; n += 1) {
    // xmax is 0-based
    if (source[n].length <= xmax + 1) {
      available.push(source[n])
      minWordLength = Math.min(minWordLength, source[n].length)
    }
  }

  const availablePaths = board.reduce((memo, _, index) => {
    memo.push(
      ...directions.reduce((newPaths, direction) => {
        const newPath = path({
          index,
          board,
          xmax,
          direction,
          depth: xmax
        })
        if (newPath.length > 0) {
          newPaths.push(newPath)
        }
        return newPaths
      }, [])
    )
    return memo
  }, [])

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

  if (fill)
    for (let x = 0; x < board.length; x += 1) {
      if (board[x].letter) continue
      board[x].letter = placedLetters[rnd(0, placedLetters.length - 1)]
    }

  return { board, placedWords }
}
