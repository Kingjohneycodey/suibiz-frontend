'use client'
import { useState, useEffect } from 'react'
import DashboardSidebar from './dashboard-sidebar'
import DashboardNavigation from './dashboard-navigation'
import { SidebarConfig } from '../../../types/sidebar'


interface DashboardLayoutClientProps {
    children: React.ReactNode
    sidebarConfig: SidebarConfig
}

export default function DashboardLayoutClient({
    children,
    sidebarConfig,
}: DashboardLayoutClientProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    isMobile: false,
  })

  const toggleSidebar = () => {
    setSidebarState(prev => ({
      ...prev,
      isCollapsed: !prev.isCollapsed
    }))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    const handleResize = () => {
      setSidebarState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Add the DashboardNavigation component here */}
      <DashboardNavigation 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
        isCollapsed={sidebarState.isCollapsed}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar 
          config={sidebarConfig}
          isCollapsed={sidebarState.isCollapsed}
          isMobile={sidebarState.isMobile}
          toggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
