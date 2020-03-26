import {
  useReducer,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  useRef,
  useMemo
} from 'react'

import * as allWords from '../dict'
import { random } from '../lib/random'
import { CELL_STATE, between, populate } from '../lib/grid'

import boardReducer, {
  disableFlag,
  setFinished,
  setFound,
  setSelected,
  resetBoard
} from '../reducers/board'

const useBoardState = ({
  opts,
  initialWords,
  onFoundWords,
  onAvailableWord
}) => {
  const initializedRef = useRef(false)

  const { board: initialBoard, placedWords } = useMemo(
    () =>
      populate({
        xmax: opts.xmax,
        ymax: opts.ymax,
        rnd: random(opts.seed),
        source: allWords[opts.wordSet],
        fill: true
      }),
    [opts.seed, opts.xmax, opts.ymax, opts.wordSet]
  )

  const words = useMemo(() => Object.keys(placedWords).sort(), [placedWords])
  useEffect(() => onAvailableWord(words), [onAvailableWord, words])

  const [board, dispatch] = useReducer(boardReducer, initialBoard)
  const [removingInactive, setRemovingInactive] = useState(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-xmax', opts.xmax)
    document.documentElement.style.setProperty('--grid-ymax', opts.ymax)
  }, [opts.xmax, opts.ymax])

  // fire before first render
  // take values from local storage and set board to found for these items
  useLayoutEffect(
    () => {
      const indexes = initialWords
        .reduce((acc, word) => acc.concat(placedWords[word]), [])
        .map(cell => cell.index)

      dispatch(
        setFound({
          indexes
        })
      )
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  )

  // reload the board if we get a new one from new `opts` prop
  // only do this AFTER initialization.

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
    } else {
      dispatch(
        resetBoard({
          board: initialBoard
        })
      )
    }
  }, [initialBoard])

  // this is an effect that removes invalid cells
  // it does so after a timeout

  useEffect(() => {
    if (removingInactive === false) return
    const tid = setTimeout(() => {
      setRemovingInactive(false)
      dispatch(
        disableFlag({
          flag: CELL_STATE.INVALID
        })
      )
    }, 500)
    return () => clearTimeout(tid)
  }, [removingInactive])

  // this fires when the selection changes during mousemove events.

  const change = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax: opts.xmax, start, end })
      dispatch(
        setSelected({
          indexes: cells.map(cell => cell.index)
        })
      )
    },
    [opts, board]
  )

  // this fires after a selection has finished (mouseup)

  const finish = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax: opts.xmax, start, end })
      const possibleWord = cells.map(cell => cell.letter)

      const foundWord = words.find(checKWord =>
        // user is allowed to select something even if they select it backwards
        [possibleWord.join(''), possibleWord.reverse().join('')].some(
          p => p === checKWord
        )
      )

      const foundWords =
        foundWord == null
          ? []
          : // make sure to get words that are enclosed within the found word
            words.filter(word => word === foundWord || foundWord.includes(word))

      if (foundWord == null) {
        // sets a flag to reset invalid after a timeout
        // (this gives time for the invalid shake)
        setRemovingInactive(true)
      } else {
        onFoundWords(foundWords)
      }

      // need to reset all selected cells on selection finish
      // this will remove SELECTED and set FOUND or INVALID
      dispatch(
        setFinished({
          found: foundWord != null,
          indexes: cells.map(cell => cell.index)
        })
      )
    },
    [opts, board, onFoundWords, words]
  )

  // this fires after a selection abort (mouseout)

  const abort = useCallback(
    () =>
      dispatch(
        disableFlag({
          flag: CELL_STATE.SELECTED
        })
      ),
    []
  )

  return { board, finish, change, abort }
}

export { useBoardState }
