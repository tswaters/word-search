import React, { memo } from 'react'
import { board as boardClassName } from '../css/index'
import { useMouseTracking } from '../hooks/mouse-tracker'
import { useBoardState } from '../hooks/board-logic'

import Cell from './Cell'

const Board = () => {
  const { board, onAbort, onChange, onFinish } = useBoardState()

  const {
    ref,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp
  } = useMouseTracking({ onAbort, onChange, onFinish })

  return (
    <div
      ref={ref}
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

export { Board }

export default memo(Board)
