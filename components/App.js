import React, { useCallback } from 'react'
import { hot } from 'react-hot-loader/root'
import { string } from 'prop-types'

import { container, menu, header } from '../css/index'
import Game from './Game'
import Form from './Form'
import ButtonToggle from './ButtonToggle'
import LightSwitch from './LightSwitch'
import { useStorage } from '../hooks/storage'

const App = ({ APP_VERSION }) => {
  const [opts, setOpts] = useStorage('wordSearch', {
    seed: 2,
    xmax: 20,
    ymax: 15,
    wordSet: 'space',
  })
  const [found, setFound] = useStorage('foundWords', [])

  const handleNewGame = useCallback(
    (newOpts) => {
      setOpts({ ...newOpts, seed: Math.floor(Math.random() * 500) })
      setFound([])
    },
    [setOpts, setFound]
  )

  const handleNewWords = useCallback(
    (newWords) => {
      setFound((prev) => {
        const items = new Set(prev)
        newWords.forEach((item) => items.add(item))
        return items.length === prev.length ? prev : Array.from(items)
      })
    },
    [setFound]
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
          version: {APP_VERSION} game: {opts.seed}
        </ButtonToggle>
      </div>
      <Game
        xmax={opts.xmax}
        ymax={opts.ymax}
        seed={opts.seed}
        wordSet={opts.wordSet}
        found={found}
        onFound={handleNewWords}
      />
    </div>
  )
}

App.propTypes = {
  APP_VERSION: string.isRequired,
}

export default hot(App)
