'use client'
import { useState, useEffect } from 'react'

export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(false)
    console.log({ darkMode });
    useEffect(() => {
        const storedValue = localStorage.getItem('darkMode')
        console.log("store");
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
        console.log("here")
        localStorage.setItem('darkMode', String(newMode))
    }

    return { darkMode, toggleDarkMode }
}