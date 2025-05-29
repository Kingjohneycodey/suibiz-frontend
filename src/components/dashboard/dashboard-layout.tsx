"use client";
import { useState, useEffect } from 'react';
import { useMobileDetection } from '../../../hooks/useMobileDetection';
import { useDarkMode } from '../../../hooks/useDarkMode';
import DashboardContent from './dashboard-content';
import DashboardNavigation from './dashboard-navigation';
import DashboardSidebar from './dashboard-sidebar';


export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');
    
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
                    activeItem={activeItem}
                    toggleSidebar={toggleSidebar}
                    setActiveItem={setActiveItem}
                />
                
                <DashboardContent activeItem={activeItem} />
            </div>
        </div>
    );
}