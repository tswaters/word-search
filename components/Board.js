import React, { memo, useContext } from 'react'
import {
  board as boardClassName,
  grid as gridClassName,
  cell as cellClassName,
} from '../css/index'

import { GameContext } from './Game'
import { useGridLayout } from '../hooks/use-grid-layout'

const Board = () => {
  const { board } = useContext(GameContext)
  const { gridRef, gridStyles } = useGridLayout()
  return (
    <div
      ref={gridRef}
      className={`${boardClassName} ${gridClassName}`}
      style={gridStyles}
    >
      {board.map((letter, index) => (
        <div key={index} className={cellClassName}>
          {letter ? letter : '\u00A0'}
        </div>
      ))}
    </div>
  )
}

export { Board }

export default memo(Board)
