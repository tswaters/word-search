import { useEffect, useCallback, useState } from 'react'
import { CELL_STATE, between } from '../lib/grid'

const useBoardState = ({ opts: { xmax }, initialBoard, checkWord }) => {
  const [board, setBoard] = useState(initialBoard)

  // reload the board if we get a new one from props
  useEffect(() => {
    setBoard(initialBoard)
  }, [initialBoard])

  const [delayedRemoval, setDelayedRemoval] = useState(null)

  useEffect(() => {
    if (delayedRemoval == null) return
    const tid = setTimeout(() => {
      setDelayedRemoval(null)
      setBoard(board =>
        board.map(cell =>
          cell.state & CELL_STATE.INVALID
            ? { ...cell, state: cell.state & ~CELL_STATE.INVALID }
            : cell
        )
      )
    }, 500)
    return () => clearTimeout(tid)
  }, [delayedRemoval])

  // use xor to figure out if we need to flip the SELECTED bit.
  // this is - (match and notHasFlag) OR (notMatch and hasFlag)
  // javascript needs numbers for the XOR operator, so wrap in Number

  const change = useCallback(
    ({ start, end }) =>
      setBoard(board => {
        const cells = between({ board, xmax: xmax - 1, start, end })
        const indexes = cells.map(cell => cell.index)
        return board.map((cell, index) =>
          Number(indexes.includes(index)) ^
          Number(Boolean(cell.state & CELL_STATE.SELECTED))
            ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
            : cell
        )
      }),
    [xmax]
  )

  // need to set all selected cells on selection finish
  // remove SELECTED flag and set either INVALID or FOUND

  const finish = useCallback(
    ({ start, end }) =>
      setBoard(board => {
        const cells = between({ board, xmax: xmax - 1, start, end })
        const indexes = cells.map(cell => cell.index)
        const foundWord = checkWord(cells.map(cell => cell.letter))
        if (!foundWord) setDelayedRemoval(CELL_STATE.INVALID)
        const f = foundWord ? CELL_STATE.FOUND : CELL_STATE.INVALID
        return board.map((cell, index) =>
          indexes.includes(index)
            ? { ...cell, state: (cell.state & ~CELL_STATE.SELECTED) | f }
            : cell
        )
      }),
    [checkWord, xmax]
  )

  // need to change any cell that has selected flag
  // if the selected flag is present, remove it!

  const abort = useCallback(
    () =>
      setBoard(board =>
        board.map(cell =>
          cell.state & CELL_STATE.SELECTED
            ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
            : cell
        )
      ),
    []
  )

  return { board, finish, change, abort }
}

export { useBoardState }
