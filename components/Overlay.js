import React, { memo, useContext } from 'react'
import { number, string, shape } from 'prop-types'
import { GameContext } from './Game'
import { overlay } from '../css/index'
import { xy } from '../lib/grid'

const Overlay = ({ range, className = '' }) => {
  const { xmax, cellWidth, cellHeight } = useContext(GameContext)
  const { startIndex, endIndex } = range

  if (startIndex === endIndex) {
    return null
  }

  const [startX, startY] = xy(xmax, startIndex)
  const [endX, endY] = xy(xmax, endIndex)

  const widgetX = cellWidth * (endX - startX)
  const widgetY = cellHeight * (endY - startY)
  const inverse = endX < startX ? 180 : 0
  const rotateDeg = Math.atan(widgetY / widgetX) / (Math.PI / 180) - inverse
  const baseWidth = Math.max(cellWidth, cellHeight)
  const style = {
    '--start-x': startX,
    '--start-y': startY,
    width: `${baseWidth + (widgetX ** 2 + widgetY ** 2) ** 0.5}px`,
    transform: `rotate(${rotateDeg.toFixed(2)}deg)`,
  }

  return <div className={`${className} ${overlay}`} style={style} />
}

Overlay.propTypes = {
  width: number,
  height: number,
  range: shape({
    startIndex: number,
    endIndex: number,
  }).isRequired,
  className: string,
}

export { Overlay }

export default memo(Overlay)
