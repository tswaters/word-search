import { arrayOf, shape, number, string } from 'prop-types'

export const cell = shape({
  letter: string,
  state: number.isRequired
})

export const board = arrayOf(cell)

export const opts = shape({
  xmax: number.isRequired,
  ymax: number.isRequired
})
