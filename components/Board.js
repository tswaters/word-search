import React, { memo } from 'react'
import { object } from 'prop-types'
import { board as boardClassName } from '../css/index'
import { useMouseTracking } from '../hooks/mouse-tracker'
import { useBoardState } from '../hooks/board-logic'

import Cell from './Cell'

const Board = ({ opts, ...props }) => {
  const { board, ...rest } = useBoardState({ opts, ...props })
  return (
    <div {...useMouseTracking({ opts, ...rest })} className={boardClassName}>
      {board.map((cell, index) => (
        <Cell cell={cell} key={index} />
      ))}
    </div>
  )
}

Board.propTypes = {
  opts: object.isRequired
}

export { Board }

export default memo(Board)
