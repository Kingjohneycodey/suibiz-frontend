"use client";
import { useState, useEffect } from 'react';
import { useMobileDetection } from '../../../hooks/useMobileDetection';
import { useDarkMode } from '../../../hooks/useDarkMode';
import DashboardNavigation from './dashboard-navigation';
import { useHasMounted } from '../../../hooks/useHasMounted';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const hasMounted = useHasMounted()

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const { isMobile } = useMobileDetection();


    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true);
        }
    }, [isMobile]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    if (!hasMounted) return null

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
            <DashboardNavigation 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                toggleSidebar={toggleSidebar}
                isCollapsed={isCollapsed}
            />
        
            <div className="flex flex-1 overflow-hidden relative">
                <main className={`flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900`}>
                    {children}
                </main>
            </div>
        </div>
    );
}