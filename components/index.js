import React from 'react'
import { render } from 'react-dom'
import * as offline from 'offline-plugin/runtime'

import App from './App'

if (NODE_ENV === 'production')
  offline.install({
    onUpdateReady: () => offline.applyUpdate(),
    onUpdated: () => window.location.reload()
  })

const NUM_GAMES = 500
const STORAGE_KEY = 'wordSearch'

let opts = localStorage.getItem(STORAGE_KEY)
if (opts) opts = JSON.parse(opts)
else {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      (opts = {
        xmax: 25,
        ymax: 25,
        wordSet: 'space'
      })
    )
  )
}

const handleFactorReset = () => {
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}

const handleNewOpts = newOpts =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newOpts))

render(
  <>
    <button onClick={handleFactorReset}>Factory Reset</button>
    <App
      APP_VERSION={APP_VERSION}
      NUM_GAMES={NUM_GAMES}
      onUpdateOpts={handleNewOpts}
      opts={opts}
    />
  </>,
  document.getElementById('root')
)
