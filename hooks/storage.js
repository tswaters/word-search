import { useEffect, useState, useCallback } from 'react'

// note don't care about new values coming in from key/default params
// loading initial options is a 1-time deal to bootstrap the application.
// after that initial boot, updates (and state) is managed by this hook
// by way of the 2nd parameter.

let cachedOpts = {}

const getValueOrDefault = (STORAGE_KEY, defaultValue) => {
  if (cachedOpts[STORAGE_KEY] != null) return cachedOpts[STORAGE_KEY]
  let savedOpts = localStorage.getItem(STORAGE_KEY)
  if (savedOpts != null) savedOpts = JSON.parse(savedOpts)
  else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify((savedOpts = defaultValue))
    )
  }

  cachedOpts[STORAGE_KEY] = savedOpts
  return savedOpts
}

const useStorage = (key, d) => {
  const [newValue, setVal] = useState(getValueOrDefault(key, d))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, [key, newValue])

  return [newValue, useCallback(val => setVal(val), [])]
}

export { useStorage }
