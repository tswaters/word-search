import {
  useReducer,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  useMemo,
  useContext
} from 'react'

import { CELL_STATE, between } from '../lib/grid'

import boardReducer, {
  disableFlag,
  setFinished,
  setFound,
  setSelected,
  resetBoard
} from '../reducers/board'
import { GameContext } from '../components/Game'
import { useEffectAvoidInit } from './use-effect-avoid-init'

const useBoardState = () => {
  const {
    xmax,
    ymax,
    board: initialBoard,
    placedWords,
    foundWords,
    onFoundWords
  } = useContext(GameContext)

  const availableWords = useMemo(() => Object.keys(placedWords).sort(), [
    placedWords
  ])

  const [board, dispatch] = useReducer(boardReducer, initialBoard)
  const [removingInactive, setRemovingInactive] = useState(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-xmax', xmax)
    document.documentElement.style.setProperty('--grid-ymax', ymax)
  }, [xmax, ymax])

  // fire before first render
  // take values from local storage and set board to found for these items
  useLayoutEffect(
    () => {
      const indexes = foundWords
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
  // this prevents destroying our initial found values set above.

  useEffectAvoidInit(() => {
    dispatch(
      resetBoard({
        board: initialBoard
      })
    )
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

  const onChange = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax, start, end })
      dispatch(
        setSelected({
          indexes: cells.map(cell => cell.index)
        })
      )
    },
    [xmax, board]
  )

  // this fires after a selection has finished (mouseup)

  const onFinish = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax: xmax, start, end })
      const possibleWord = cells.map(cell => cell.letter)

      const foundWord = availableWords.find(checKWord =>
        // user is allowed to select something even if they select it backwards
        [possibleWord.join(''), possibleWord.reverse().join('')].some(
          p => p === checKWord
        )
      )

      const foundWords =
        foundWord == null
          ? []
          : // make sure to get words that are enclosed within the found word
            availableWords.filter(
              word => word === foundWord || foundWord.includes(word)
            )

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
    [xmax, board, onFoundWords, availableWords]
  )

  // this fires after a selection abort (mouseout)

  const onAbort = useCallback(
    () =>
      dispatch(
        disableFlag({
          flag: CELL_STATE.SELECTED
        })
      ),
    []
  )

  return { board, onFinish, onChange, onAbort }
}

export { useBoardState }
