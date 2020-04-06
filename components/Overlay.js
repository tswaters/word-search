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

  const deltaX = endX - startX
  const deltaY = endY - startY
  const widgetX = cellWidth * deltaX
  const widgetY = cellHeight * deltaY
  const widgetWidth = (widgetX ** 2 + widgetY ** 2) ** 0.5 // pothag, my man
  let rotateDeg = Math.atan(widgetY / widgetX) / (Math.PI / 180)
  if (endX < startX) {
    console.log(
      `delta: {${deltaX},${deltaY}}, widgetWidth ${widgetWidth}, rotateDeg ${rotateDeg.toFixed(
        2
      )}`
    )
  }

  const cssTop = cellHeight * startY
  const cssLeft = cellWidth * startX
  let cssWidth = null
  let cssHeight = null

  // the widths/heights will be different based on the rotation
  // at 90deg (vertical) the width becomes height and vice versa
  switch (rotateDeg) {
    case 0:
      // horizontal
      cssWidth = cellWidth + widgetWidth
      cssHeight = cellHeight
      break
    case 90:
      // vertical
      cssWidth = cellHeight + widgetWidth
      cssHeight = cellWidth
      break
    default:
      // diagonal
      cssWidth = Math.max(cellWidth, cellHeight) + widgetWidth
      cssHeight = Math.min(cellWidth, cellHeight)
  }

  const style = {
    top: `${cssTop}px`,
    left: `${cssLeft}px`,
    height: `${cssHeight}px`,
    width: `${cssWidth}px`,
    transform: `rotate(${rotateDeg.toFixed(2)}deg)`,
    transformOrigin: `${cellWidth / 2}px center`
  }

  if (rotateDeg !== 90 && rotateDeg !== 0) {
    style.transform = `${style.transform} skewX(-10deg)`
    // style.top = `-${cellHeight / 2}px`
    // style.left = `-${cellWidth / 2}px`
  }

  return <div className={`${className} ${overlay}`} style={style} />
}

Overlay.propTypes = {
  width: number,
  height: number,
  range: shape({
    startIndex: number,
    endIndex: number
  }).isRequired,
  className: string
}

export { Overlay }

export default memo(Overlay)
