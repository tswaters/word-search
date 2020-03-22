import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { string } from 'prop-types'

import { container, menu, header, game } from '../css/index'
import Form from './Form'
import Board from './Board'
import WordList from './WordList'
import ButtonToggle from './ButtonToggle'

import * as words from '../dict'
import { random } from '../lib/random'
import { populate } from '../lib/grid'
import { LightSwitch } from './LightSwitch'
import { useStorage } from '../hooks/storage'

const App = ({ APP_VERSION }) => {
  const [seed, setSeed] = useState(2)
  const [opts, setOpts] = useStorage('wordSearch', {
    seed: 2,
    xmax: 15,
    ymax: 15,
    wordSet: 'space'
  })
  const [foundWords, setFoundWords] = useState([])

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-xmax', opts.xmax)
    document.documentElement.style.setProperty('--grid-ymax', opts.ymax)
  }, [opts.xmax, opts.ymax])

  const handleNewGame = useCallback(
    newOpts => {
      setOpts(newOpts)
      setFoundWords([])
      setSeed(Math.floor(Math.random() * 500))
    },
    [setOpts]
  )

  const { board, placedWords } = useMemo(
    () =>
      populate({
        xmax: opts.xmax,
        ymax: opts.ymax,
        rnd: random(seed),
        source: words[opts.wordSet],
        fill: true
      }),
    [seed, opts.xmax, opts.ymax, opts.wordSet]
  )

  const checkWord = useCallback(
    letters => {
      const forwards = letters.join('')
      const backwards = letters.reverse().join('')
      const foundWord = placedWords.find(word =>
        [forwards, backwards].includes(word)
      )
      if (foundWord) {
        setFoundWords(foundWords => foundWords.concat(foundWord))
      }
      return foundWord
    },
    [placedWords]
  )

  return (
    <div className={container}>
      <h1 className={header}>Word Search</h1>
      <div className={menu}>
        <ButtonToggle icon={['☰︎']} label={['Open Menu']}>
          <Form opts={opts} onNewGame={handleNewGame} />
        </ButtonToggle>
        <LightSwitch />
        <ButtonToggle icon={['❓︎']} label={['About']}>
          version: {APP_VERSION} game: {seed}
        </ButtonToggle>
      </div>
      <div className={game}>
        <Board opts={opts} board={board} checkWord={checkWord} />
        <WordList words={placedWords} foundWords={foundWords} />
      </div>
    </div>
  )
}

App.propTypes = {
  APP_VERSION: string.isRequired
}

export default hot(App)
