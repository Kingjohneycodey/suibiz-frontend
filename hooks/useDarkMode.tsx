"use client";
import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check localStorage for user preference
        const savedMode = localStorage.getItem('darkMode') === 'true';
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        setDarkMode(savedMode || systemPrefersDark);
    }, []);

    useEffect(() => {
        if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
        } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return { darkMode, toggleDarkMode };
}