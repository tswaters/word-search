import React, { memo, useContext } from 'react'
import { found as foundClassName, grid as gridClassName } from '../css/index'

import Overlay from './Overlay'
import { GameContext } from './Game'
import { useGridLayout } from '../hooks/use-grid-layout'

const FoundWords = () => {
  const { found, placed } = useContext(GameContext)
  const { gridRef, gridStyles } = useGridLayout()
  return (
    <div
      ref={gridRef}
      className={`${foundClassName} ${gridClassName}`}
      style={gridStyles}
    >
      {found.map(word => (
        <Overlay key={word} className={foundClassName} range={placed[word]} />
      ))}
    </div>
  )
}

export { FoundWords }

export default memo(FoundWords)
