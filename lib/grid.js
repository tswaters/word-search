const N = 0b1000
const S = 0b0100
const E = 0b0010
const W = 0b0001

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

const getMinLength = array =>
  array.reduce((memo, { length }) => (length < memo ? length : memo), Infinity)

const getMaxLength = array =>
  array.reduce((memo, { length }) => (length > memo ? length : memo), 0)

export const paths = ({ index, board, xmax, dirs = MOVEMENTS }) =>
  Object.entries(dirs).reduce((memo, [key, move]) => {
    key = parseInt(key, 10) // keys are always strings, we want int comparisons
    const acc = []
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
      (key === N || key === S || (key & E && x > orig) || (key & W && x < orig))
    )
    if (acc.length === 1) return memo
    memo.push(acc)
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

  const dirs = directions.reduce(
    (memo, item) => ({
      ...memo,
      [DIRECTIONS[item]]: MOVEMENTS[item]
    }),
    {}
  )

  const placedWords = []
  const placedLetters = []
  const minWordLength = getMinLength(source)

  const availablePaths = board.reduce(
    (memo, _, index) => [
      ...memo,
      ...paths({ board, index, xmax, dirs }).filter(
        path => path.length >= minWordLength
      )
    ],
    []
  )

  const maxWordLength = getMaxLength(availablePaths)

  const available = [...source.filter(word => word.length <= maxWordLength)]

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
