import React, { memo, useEffect } from 'react'
import ButtonToggle from './ButtonToggle'

import { darkMode as darkModeClass } from '../css/index'
import { useStorage } from '../hooks/storage'

const { matches: defaultDarkMode } = window.matchMedia(
  '(prefers-color-scheme: dark)'
)

const LightSwitch = () => {
  const [darkMode, setDarkMode] = useStorage('darkMode', defaultDarkMode)

  useEffect(() => {
    document.body.classList.toggle(darkModeClass, darkMode)
  }, [darkMode])

  return (
    <ButtonToggle
      initial={darkMode}
      icon={['🌙', '💡']}
      label={['Turn on dark mode', 'Turn off dark mode']}
      onToggle={setDarkMode}
      esc={false}
    />
  )
}

export { LightSwitch }
export default memo(LightSwitch)
