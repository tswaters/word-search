import React, { memo, useState, useEffect, useCallback } from 'react'
import { func } from 'prop-types'

import { board as boardType, opts as optsType } from './_types'
import { board as boardClassName } from '../css/index'
import { between, CELL_STATE } from '../lib/grid'
import { useMouseTracking } from '../hooks/mouse-tracker'
import Cell from './Cell'

const cellWidth = 25

const Board = ({ opts, board: initialBoard, checkWord }) => {
  // reload the board if we get a new one from props
  const [board, setBoard] = useState(initialBoard)
  useEffect(() => {
    setBoard(initialBoard)
  }, [initialBoard])

  // removes a flag after a period of time
  // this is used to remove `invalid` after a shake transition
  // if any of the cells have the defined flag, remove it.

  const [delayedRemoval, setDelayedRemoval] = useState(null)
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

  // invoke the mouse tracking hook
  // it gives us a ref/mouse handlers to attach, and we give it what happens when user interacts with the board.
  // each of these receives `start` and `end` which are two indexes between the board array
  // there's a grid utility to turn this into the array of cells between those two indexes
  // in practice, we mutate the cells returned somehow, adding/removing bit flags (selected, found, invalid 0 (none))

  const {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  } = useMouseTracking({
    opts,
    cellWidth,

    // need to set all selected cells on selection finish
    // remove SELECTED flag and set either INVALID or FOUND
    onSelectionFinish: useCallback(
      ({ start, end }) => {
        setBoard(board => {
          const cells = between({ board, xmax: opts.xmax - 1, start, end })
          const indexes = cells.map(cell => cell.index)
          const foundWord = checkWord(cells.map(cell => cell.letter))
          if (!foundWord) setDelayedRemoval(CELL_STATE.INVALID)
          const f = foundWord ? CELL_STATE.FOUND : CELL_STATE.INVALID
          return board.map((cell, index) =>
            indexes.includes(index)
              ? { ...cell, state: (cell.state & ~CELL_STATE.SELECTED) | f }
              : cell
          )
        })
      },
      [opts, checkWord]
    ),

    // use xor to figure out if we need to flip the SELECTED bit.
    // this is - (match and notHasFlag) OR (notMatch and hasFlag)
    // javascript needs numbers for the XOR operator, so wrap in Number
    onSelectionChange: useCallback(
      ({ start, end }) => {
        setBoard(board => {
          const cells = between({ board, xmax: opts.xmax - 1, start, end })
          const indexes = cells.map(cell => cell.index)
          return board.map((cell, index) =>
            Number(indexes.includes(index)) ^
            Number(Boolean(cell.state & CELL_STATE.SELECTED))
              ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
              : cell
          )
        })
      },
      [opts]
    ),

    // need to change any cell that has selected flag
    // remove the selected flag!
    onSelectionAbort: useCallback(() => {
      setBoard(board =>
        board.map(cell =>
          cell.state & CELL_STATE.SELECTED
            ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
            : cell
        )
      )
    }, [])
  })

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
