import React, { memo } from 'react'
import { func } from 'prop-types'

import { board as boardType, opts as optsType } from './_types'
import { board as boardClassName } from '../css/index'
import { useMouseTracking } from '../hooks/mouse-tracker'
import { useBoardState } from '../hooks/board-logic'

import Cell from './Cell'

const cellWidth = 25

const Board = ({ opts, board: initialBoard, checkWord }) => {
  // infer the board's state by using the boardState hook
  // this handles updating the array with new values based upon the mouse conditions below
  // we'll get back board which is the latest state value
  const { board, change, finish, abort } = useBoardState({
    initialBoard,
    opts,
    checkWord
  })

  // useMouseTracking watches the mouse after mousedown
  // it gives us a ref/mouse handlers to attach, and we give it what happens when user interacts with the board.
  // each function receives :
  // - `start`: the indexes at which the mouse down started
  // - `end`: the current position.
  // it will invoke a series of functions (finish, select, abort) when conditions arise:
  // - abort -- mouse moved outside the container
  // - select -- mouse moves over new cells
  // - finish -- mouse-up is pressed

  const {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  } = useMouseTracking({
    opts,
    cellWidth,
    change,
    finish,
    abort
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
