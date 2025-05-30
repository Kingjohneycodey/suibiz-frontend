'use client'
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false) // Start with false during SSR

    useEffect(() => {
        const storedValue = localStorage.getItem('darkMode')
            if (storedValue !== null) {
                setDarkMode(storedValue === 'true')
            } else {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                setDarkMode(systemPrefersDark)
            }
    }, [])


    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem('darkMode', String(newMode))
    }

    return { darkMode, toggleDarkMode }
}