import { arrayOf, shape, number, string, bool } from 'prop-types'

export const cell = shape({
  letter: string.isRequired,
  selected: bool
})

export const board = arrayOf(cell)

export const opts = shape({
  xmax: number.isRequired,
  ymax: number.isRequired
})
