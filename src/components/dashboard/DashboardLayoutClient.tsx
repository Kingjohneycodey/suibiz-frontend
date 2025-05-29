'use client'
import { useState, useEffect } from 'react'
import { useMobileDetection } from '../../../hooks/useMobileDetection'
import { useDarkMode } from '../../../hooks/useDarkMode'
import DashboardNavigation from './dashboard-navigation'
import DashboardSidebar from './dashboard-sidebar'

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { darkMode, toggleDarkMode } = useDarkMode()
    const { isMobile } = useMobileDetection()

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true)
        }
    }, [isMobile])

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
            <DashboardNavigation 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
                toggleSidebar={toggleSidebar} 
                isCollapsed={isCollapsed} 
            />

            <div className="flex flex-1 overflow-hidden relative">
                <DashboardSidebar 
                    isCollapsed={isCollapsed} 
                    isMobile={isMobile} 
                    toggleSidebar={toggleSidebar} 
                />

                {isMobile && !isCollapsed && (
                    <div 
                        className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                <main className={`flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out`}>
                    {children}
                </main>
            </div>
        </div>
    )
}