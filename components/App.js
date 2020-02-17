import React, { useState, useMemo, useCallback } from 'react'
import { hot } from 'react-hot-loader/root'
import { string, func } from 'prop-types'
import { opts as optsType } from './_types'

import { container, header, game } from '../css/index'
import Form from './Form'
import Board from './Board'
import WordList from './WordList'

import * as words from '../dict'
import { random } from '../lib/random'
import { populate } from '../lib/grid'

const App = ({ opts: savedOpts, onUpdateOpts, APP_VERSION }) => {
  const [seed, setSeed] = useState(2)
  const [opts, setOpts] = useState(savedOpts)

  const handleReset = useCallback(
    newOpts => {
      setOpts(newOpts)
      onUpdateOpts(newOpts)
      setSeed(Math.floor(Math.random() * 500))
    },
    [onUpdateOpts]
  )

  const { board, placedWords } = useMemo(
    () =>
      populate({
        xmax: opts.xmax - 1,
        ymax: opts.ymax - 1,
        rnd: random(seed),
        source: words[opts.wordSet],
        fill: true
      }),
    [seed, opts]
  )

  return (
    <div className={container}>
      <h1 className={header}>
        Word Search v{APP_VERSION} Game#: {seed}
      </h1>
      <Form opts={opts} onReset={handleReset} />
      <div className={game}>
        <Board opts={opts} board={board} />
        <WordList words={placedWords} />
      </div>
    </div>
  )
}

App.propTypes = {
  APP_VERSION: string.isRequired,
  onUpdateOpts: func.isRequired,
  opts: optsType.isRequired
}

export default hot(App)
