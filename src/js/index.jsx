import React from 'react'
import { render } from 'react-dom'

import { App } from './App'
import * as offline from 'offline-plugin/runtime'

offline.install({
  onUpdateReady() {
    offline.applyUpdate()
  },
  onUpdated() {
    window.location.reload()
  }
})

render(<App />, document.getElementById('root'))
