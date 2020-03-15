import React, { useState, useEffect, useCallback, memo } from 'react'

import { board as boardType, opts as optsType } from './_types'
import { board as boardClassName } from '../css/index'
import { between } from '../lib/grid'
import { useMouseTracking } from '../hooks/mouse-tracker'
import Cell, { CELL_STATE } from './Cell'

const cellWidth = 25

const Board = ({ opts, board: initialBoard }) => {
  const [board, setBoard] = useState(initialBoard)

  const onSelectionChange = useCallback(
    ({ start, end }) => {
      setBoard(board => {
        const cells = between({ board, xmax: opts.xmax - 1, start, end })
        const indexes = cells.map(cell => cell.index)
        return board.map((cell, index) => {
          if (
            Number(indexes.includes(index)) ^
            Number(Boolean(cell.state & CELL_STATE.SELECTED))
          ) {
            return { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
          }
          return cell
        })
      })
    },
    [opts]
  )

  const onSelectionFinish = useCallback(
    ({ start, end }) => {
      setBoard(board => {
        const cells = between({ board, xmax: opts.xmax - 1, start, end })
        const word = cells.map(cell => cell.letter).join('')
        console.log(word)
      })
    },
    [opts]
  )

  const {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useMouseTracking({
    opts,
    cellWidth,
    onSelectionFinish,
    onSelectionChange
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
  board: boardType.isRequired
}

export { Board }

export default memo(Board)
