import React, { useEffect, useState, useCallback, memo } from 'react'
import { node, oneOfType, array, func, bool, arrayOf, string } from 'prop-types'
import { button as buttonClass } from '../css'

const ButtonToggle = ({
  initial,
  icon: [off, on = '❌︎'],
  label: [offLabel, onLabel = 'Close'],
  children,
  onToggle,
  esc = true,
}) => {
  const [toggle, setToggled] = useState(initial || false)

  useEffect(() => {
    if (!esc || !toggle) return
    const handler = (e) => {
      if (e.keyCode !== 27) return
      setToggled(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [esc, toggle])

  useEffect(() => {
    setToggled(initial || false)
  }, [initial])

  useEffect(() => {
    onToggle?.(toggle)
  }, [onToggle, toggle])

  const handleToggle = useCallback(() => setToggled((toggled) => !toggled), [])

  return (
    <>
      {toggle && children}
      <button
        role="switch"
        title={toggle ? onLabel : offLabel}
        aria-label={toggle ? onLabel : offLabel}
        aria-checked={toggle}
        onClick={handleToggle}
        type="button"
        className={buttonClass}
      >
        {toggle ? on : off}
      </button>
    </>
  )
}

ButtonToggle.propTypes = {
  initial: bool,
  icon: arrayOf(string),
  label: arrayOf(string),
  children: oneOfType([array, node]),
  onToggle: func,
  esc: bool,
}

export { ButtonToggle }

export default memo(ButtonToggle)
