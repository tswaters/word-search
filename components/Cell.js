import React, { useCallback, memo } from 'react'
import { cell as cellType } from './_types'
import { cell as cellClassName, selected as selectedClass } from '../css/index'
import { func } from 'prop-types'

const Cell = ({ cell, onSelect }) => {
  const { index, letter, selected } = cell

  const handleClick = useCallback(() => {
    onSelect(index, !selected)
  }, [onSelect, index, selected])

  return (
    <div
      onClick={handleClick}
      className={`${cellClassName} ${selected ? selectedClass : ''}`}
    >
      {letter ? letter : '\u00A0'}
    </div>
  )
}

Cell.propTypes = {
  cell: cellType.isRequired,
  onSelect: func.isRequired
}

export { Cell }

export default memo(Cell)
