import React, { useState, useEffect, useCallback, memo } from 'react'
import { func } from 'prop-types'

import { board as boardType, opts as optsType } from './_types'
import { board as boardClassName } from '../css/index'
import { between, CELL_STATE } from '../lib/grid'
import { useMouseTracking } from '../hooks/mouse-tracker'
import Cell from './Cell'

const cellWidth = 25

const Board = ({ opts, board: initialBoard, checkWord }) => {
  const [board, setBoard] = useState(initialBoard)
  const [delayedRemoval, setDelayedRemoval] = useState(null)

  const onSelectionAbort = useCallback(() => {
    setBoard(board => {
      return board.map(cell =>
        cell.state & CELL_STATE.SELECTED
          ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
          : cell
      )
    })
  }, [])

  const onSelectionChange = useCallback(
    ({ start, end }) => {
      setBoard(board => {
        const cells = between({ board, xmax: opts.xmax - 1, start, end })
        const indexes = cells.map(cell => cell.index)
        return board.map((cell, index) =>
          // use xor to figure out if we need to flip the SELECTED bit.
          // this is - (match and notHasFlag) OR (notMatch and hasFlag)
          // javascript needs numbers for the XOR operator, so wrap in Number
          Number(indexes.includes(index)) ^
          Number(Boolean(cell.state & CELL_STATE.SELECTED))
            ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
            : cell
        )
      })
    },
    [opts]
  )

  const onSelectionFinish = useCallback(
    ({ start, end }) => {
      setBoard(board => {
        const cells = between({ board, xmax: opts.xmax - 1, start, end })
        const indexes = cells.map(cell => cell.index)
        const foundWord = checkWord(cells.map(cell => cell.letter))
        if (!foundWord) setDelayedRemoval(CELL_STATE.INVALID)
        const setFlag = foundWord ? CELL_STATE.FOUND : CELL_STATE.INVALID

        // need to set all selected cells on selection finish
        // remove SELECTED flag and set either INVALID or FOUND
        return board.map((cell, index) =>
          indexes.includes(index)
            ? { ...cell, state: (cell.state & ~CELL_STATE.SELECTED) | setFlag }
            : cell
        )
      })
    },
    [opts, checkWord]
  )

  // remove a flag over a period of time
  // this is used to remove `invalid` after a shake transition
  // if any of the cells have the defined flag, remove the flag.
  useEffect(() => {
    if (delayedRemoval == null) return
    const tid = setTimeout(() => {
      setDelayedRemoval(null)
      setBoard(board =>
        board.map(cell =>
          cell.state & delayedRemoval
            ? { ...cell, state: cell.state & ~delayedRemoval }
            : cell
        )
      )
    }, 500)
    return () => clearTimeout(tid)
  }, [delayedRemoval])

  const {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  } = useMouseTracking({
    opts,
    cellWidth,
    onSelectionFinish,
    onSelectionChange,
    onSelectionAbort
  })

  useEffect(() => {
    setBoard(initialBoard)
  }, [initialBoard])

  useEffect(() => {
    document.documentElement.style.setProperty('--cell-count', opts.xmax)
  }, [opts.xmax])

  return (
    <div
      ref={boardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={boardClassName}
    >
      {board.map((cell, index) => (
        <Cell cell={cell} key={index} />
      ))}
    </div>
  )
}

Board.propTypes = {
  opts: optsType.isRequired,
  board: boardType.isRequired,
  checkWord: func.isRequired
}

export { Board }

export default memo(Board)
