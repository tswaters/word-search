import React from 'react'
import { render } from 'react-dom'
import * as offline from 'offline-plugin/runtime'

import App from './App'

if (NODE_ENV === 'production')
  offline.install({
    onUpdateReady: () => offline.applyUpdate(),
    onUpdated: () => window.location.reload()
  })

render(<App APP_VERSION={APP_VERSION} />, document.getElementById('root'))
