"use client";
import { useState } from 'react';
import { Menu, Search, Sun, Moon, Bell, User, LogOut } from 'lucide-react';

interface DashboardNavigationProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    isCollapsed: boolean;
}

export default function DashboardNavigation({
    darkMode,
    toggleDarkMode,
    toggleSidebar,
    isCollapsed
}: DashboardNavigationProps) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleSignOut = () => {
        console.log('Signing out...');
        setShowProfileDropdown(false);
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <Menu className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                    </button>
                    
                    {/* Show dashboard title only when not collapsed or on mobile */}
                    {(!isCollapsed || window.innerWidth < 768) && (
                        <div className="text-xl font-bold text-gray-800 dark:text-white">
                            Dashboard
                        </div>
                    )}
                    
                    {/* Show search bar only when not collapsed on desktop */}
                    {!isCollapsed && (
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? (
                            <Sun className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        ) : (
                            <Moon className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        )}
                    </button>

                    <button 
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                        aria-label="Notifications"
                    >
                        <Bell className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="User profile"
                        >
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <User className="w-5 h-5" />
                            </div>
                            {/* Hide username when sidebar is collapsed */}
                            {!isCollapsed && (
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                                    John Doe
                                </span>
                            )}
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <LogOut className="mr-3 w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
                
            {/* Always show mobile search regardless of collapsed state */}
            <div className="px-4 pb-4 md:hidden">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 rounded-lg dark:text-white bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </header>
    );
}   