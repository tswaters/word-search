import React, { useCallback, useState, useEffect, memo } from 'react'
import { func, shape, number } from 'prop-types'

import * as words from '../dict'

const wordSets = Object.keys(words)

const Form = ({ onReset, opts: initialOpts }) => {
  const [opts, setOpts] = useState(initialOpts)

  useEffect(() => setOpts(initialOpts), [initialOpts])

  const handleReset = useCallback(
    e => {
      e.preventDefault()
      let { xmax, ymax, wordSet } = opts
      xmax = parseInt(xmax)
      ymax = parseInt(ymax)
      if (Number.isNaN(xmax)) xmax = initialOpts.xmax
      if (Number.isNaN(ymax)) ymax = initialOpts.ymax
      const newOpts = { xmax, ymax, wordSet }
      setOpts(newOpts)
      onReset(newOpts)
    },
    [onReset, opts, initialOpts.xmax, initialOpts.ymax]
  )

  const handleUpdateXmax = useCallback(
    e => setOpts({ ...opts, xmax: e.target.value }),
    [opts]
  )

  const handleUpdateYmax = useCallback(
    e => setOpts({ ...opts, ymax: e.target.value }),
    [opts]
  )

  const handleUpdateWordset = useCallback(
    e => setOpts({ ...opts, wordSet: e.target.value }),
    [opts]
  )

  return (
    <form onSubmit={handleReset}>
      <div>
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
      <div>
        <label htmlFor="xmax">xmax</label>
        <input
          value={opts.xmax}
          type="text"
          name="xmax"
          id="xmax"
          onChange={handleUpdateXmax}
        />
      </div>
      <div>
        <label htmlFor="ymax">ymax</label>
        <input
          value={opts.ymax}
          type="text"
          name="ymax"
          id="ymax"
          onChange={handleUpdateYmax}
        />
      </div>
      <button type="submit">Reset</button>
    </form>
  )
}

Form.propTypes = {
  onReset: func.isRequired,
  opts: shape({
    xmax: number.isRequired,
    ymax: number.isRequired
  }).isRequired
}

export { Form }

export default memo(Form)
