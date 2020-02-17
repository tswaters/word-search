import React, { useState, useEffect, useCallback, memo } from 'react'
import { board as boardType, opts as optsType } from './_types'
import { board as boardClassName } from '../css/index'
import Cell from './Cell'

const Board = ({ opts, board: initialBoard }) => {
  const [board, setBoard] = useState(initialBoard)
  useEffect(() => setBoard(initialBoard), [initialBoard])

  useEffect(() => {
    document.documentElement.style.setProperty('--cell-count', opts.xmax)
  }, [opts.xmax])

  const onSelect = useCallback(
    (index, selected) => {
      setBoard(
        board.map((cell, item) =>
          item === index ? { ...board[index], selected } : cell
        )
      )
    },
    [board]
  )

  return (
    <div className={boardClassName}>
      {board.map((cell, index) => (
        <Cell onSelect={onSelect} cell={cell} key={index} />
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
