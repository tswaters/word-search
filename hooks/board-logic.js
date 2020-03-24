import {
  useReducer,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  useRef
} from 'react'
import { CELL_STATE, between } from '../lib/grid'
import { useStorage } from './storage'

import boardReducer, {
  disableFlag,
  setFinished,
  setFlag,
  setSelected,
  resetBoard
} from '../reducers/board'

const getIndexFromWords = ({ placedWords, words }) =>
  words
    .reduce((acc, word) => acc.concat(placedWords[word]), [])
    .map(cell => cell.index)

const useBoardState = ({
  opts: { xmax },
  initialBoard,
  checkWord: check,
  placedWords
}) => {
  const [board, dispatch] = useReducer(boardReducer, initialBoard)
  const initializedRef = useRef(false)
  const [allFoundWords, setAllFoundWords] = useStorage('foundWords', [])
  const [newFoundWords, setNewFoundWords] = useState(null)
  const [removingInactive, setRemovingInactive] = useState(null)

  // fire before first render
  // take values from local storage and set board to found for these items
  useLayoutEffect(
    () => {
      const indexes = allFoundWords
        .reduce((acc, word) => acc.concat(placedWords[word]), [])
        .map(cell => cell.index)
      dispatch(setFlag({ indexes, flag: CELL_STATE.FOUND }))
    },
    /* eslint-disable react-hooks/exhaustive-deps */ []
    /* eslint-enable */
  )

  // reload the board if we get a new one from props
  // only do this AFTER initialization.

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      return
    }
    dispatch(resetBoard({ board: initialBoard }))
    setAllFoundWords([])
  }, [initialBoard, setAllFoundWords])

  // this is an effect that removes invalid cells
  // it does so after a timeout

  useEffect(() => {
    if (removingInactive === false) return
    const tid = setTimeout(() => {
      setRemovingInactive(false)
      dispatch(disableFlag({ flag: CELL_STATE.INVALID }))
    }, 500)
    return () => clearTimeout(tid)
  }, [removingInactive])

  // this is an effect that sets new valid words
  // it is sent as an array of new words, afterwords, the array is cleared it. (it is NEW found words)
  // the reason it's passed one at a time and not stored as a proper array is,
  // i'd like to periodically add to it without keeping any real values in state
  // it's an attempt to solve a chicken in egg -
  // this mechanism is utilized when re-loading from local storage, above.
  // also don't need to store entire board state - same seed regenerates the same one,
  // found words can be marked as indexes to be found and after refresh they will still be found.

  useEffect(() => {
    if (!newFoundWords) return
    setNewFoundWords(null)
    setAllFoundWords(prev => {
      const items = new Set(prev)
      newFoundWords.forEach(item => items.add(item))
      return Array.from(items)
    })
    dispatch(
      setFlag({
        indexes: getIndexFromWords({ placedWords, words: newFoundWords }),
        flag: CELL_STATE.FOUND
      })
    )
  }, [newFoundWords, setAllFoundWords, placedWords])

  // this fires when the selection during a mousemove changes.

  const change = useCallback(
    ({ start, end }) => dispatch(setSelected({ xmax, start, end })),
    [xmax]
  )

  // need to set all selected cells on selection finish
  // remove SELECTED flag and INVALID (if was invalid)
  // there's a useEffect listening for the new found words
  // this will toggle found to true for relevant items.

  const finish = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax, start, end })
      const foundWords = check(cells.map(cell => cell.letter))
      if (foundWords.length === 0) setRemovingInactive(true)
      else setNewFoundWords(foundWords)
      const indexes = cells.map(cell => cell.index)
      const flag = foundWords.length === 0 ? CELL_STATE.INVALID : 0
      dispatch(setFinished({ indexes, flag }))
    },
    [check, xmax, board]
  )

  // need to change any cell that has selected flag
  // if the selected flag is present, remove it!

  const abort = useCallback(
    () => dispatch(disableFlag({ flag: CELL_STATE.SELECTED })),
    []
  )

  return { board, finish, change, abort }
}

export { useBoardState }
