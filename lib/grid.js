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

const getMinLength = array =>
  array.reduce((memo, { length }) => (length < memo ? length : memo), Infinity)

const getMaxLength = array =>
  array.reduce((memo, { length }) => (length > memo ? length : memo), 0)

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
  dirs = {
    LTR: DIRECTIONS.LTR,
    LTR_DOWN: DIRECTIONS.LTR_DOWN,
    LTR_UP: DIRECTIONS.LTR_UP,
    DOWN: DIRECTIONS.DOWN
  },
  rnd,
  maxIterations = 1000,
  fill = false
}) => {
  const board = Array((xmax + 1) * (ymax + 1))
    .fill(null)
    .map((_, index) => ({ index, letter: null }))

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

  let available = [...source.filter(word => word.length <= maxWordLength)]

  for (let n = 0; n < maxIterations && available.length > 0; n++) {
    const chosenPath = availablePaths[rnd(0, availablePaths.length - 1)]
    const rx = pathToRegexp(chosenPath)
    const matchingWords = available.filter(x => rx.test(x))
    if (matchingWords.length === 0) continue

    const chosenWord = matchingWords[rnd(0, matchingWords.length - 1)]
    placedWords.push(chosenWord)
    placedLetters.push(...chosenWord)
    chosenPath.forEach((cell, index) => (cell.letter = chosenWord[index]))
    available = available.filter(x => x !== chosenWord)
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
