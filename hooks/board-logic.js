import {
  useReducer,
  useEffect,
  useCallback,
  useState
} from 'react'
import { CELL_STATE, between } from '../lib/grid'

import boardReducer, {
  disableFlag,
  setFinished,
  setFlag,
  setSelected,
  resetBoard
} from '../reducers/board'

const useBoardState = ({ opts: { xmax }, initialBoard, checkWord }) => {
  const [board, dispatch] = useReducer(boardReducer, initialBoard)
  const [removingInactive, setRemovingInactive] = useState(null)

  // reload the board if we get a new one from props
  useEffect(() => {
    dispatch(resetBoard({ board: initialBoard }))
  }, [initialBoard])

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


  const change = useCallback(
    ({ start, end }) => dispatch(setSelected({ xmax, start, end })),
    [xmax]
  )

  // need to set all selected cells on selection finish
  // remove SELECTED flag and set either INVALID or FOUND

  const finish = useCallback(
    ({ start, end }) => {
      const cells = between({ board, xmax, start, end })
      const foundWord = checkWord(cells.map(cell => cell.letter))
      if (!foundWord) setRemovingInactive(true)
      const flag = foundWord ? CELL_STATE.FOUND : CELL_STATE.INVALID
      const indexes = cells.map(cell => cell.index)
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
