// hooks/useDarkMode.ts
'use client'
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false) // Start with false during SSR

    useEffect(() => {
        // Only access localStorage after mount
        const savedMode = localStorage.getItem('darkMode') === 'true'
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        setDarkMode(savedMode ?? systemPrefersDark)
    }, [])

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem('darkMode', String(newMode))
    }

    return { darkMode, toggleDarkMode }
}