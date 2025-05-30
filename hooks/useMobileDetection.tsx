// hooks/useMobileDetection.ts
'use client'
import { useState, useEffect } from 'react'

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false) // Default to false during SSR
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile }
}