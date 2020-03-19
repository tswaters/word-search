import React, { useCallback, useState, useEffect, memo } from 'react'
import { func, shape, number } from 'prop-types'

import { button as buttonClass, formGroup } from '../css'
import * as words from '../dict'

const wordSets = Object.keys(words)

const Form = ({ onNewGame, opts: initialOpts }) => {
  const [opts, setOpts] = useState(initialOpts)

  useEffect(() => {
    setOpts(initialOpts)
  }, [initialOpts])

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      onNewGame(opts)
    },
    [onNewGame, opts]
  )

  const handleUpdateYmax = useCallback(e => {
    e.persist()
    setOpts(opts => {
      let input = parseInt(e.target.value, 10)
      if (Number.isNaN(input)) return opts
      return { ...opts, ymax: input }
    })
  }, [])

  const handleUpdateXmax = useCallback(e => {
    e.persist()
    setOpts(opts => {
      let input = parseInt(e.target.value, 10)
      if (Number.isNaN(input)) return opts
      return { ...opts, xmax: input }
    })
  }, [])

  const handleUpdateWordset = useCallback(
    e => setOpts({ ...opts, wordSet: e.target.value }),
    [opts]
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className={formGroup}>
        <label htmlFor="wordSet">word set</label>
        <select
          id="wordSet"
          name="wordSet"
          value={opts.wordSet}
          onChange={handleUpdateWordset}
        >
          {wordSets.map(set => (
            <option value={set} key={set}>
              {set}
            </option>
          ))}
        </select>
      </div>
      <div className={formGroup}>
        <label htmlFor="xmax">width</label>
        <input
          value={opts.xmax}
          type="number"
          width={1}
          min={5}
          max={30}
          step={1}
          name="xmax"
          id="xmax"
          aria-label="xmax"
          onChange={handleUpdateXmax}
        />
      </div>
      <div className={formGroup}>
        <label htmlFor="ymax">height</label>
        <input
          value={opts.ymax}
          type="number"
          min={5}
          max={30}
          step={1}
          name="ymax"
          id="ymax"
          aria-label="ymax"
          onChange={handleUpdateYmax}
        />
      </div>
      <button
        className={buttonClass}
        type="submit"
        title="New Game"
        aria-label="New Game"
      >
        {'🔄︎'}
      </button>
    </form>
  )
}

Form.propTypes = {
  onNewGame: func.isRequired,
  opts: shape({
    xmax: number.isRequired,
    ymax: number.isRequired
  }).isRequired
}

export { Form }

export default memo(Form)
