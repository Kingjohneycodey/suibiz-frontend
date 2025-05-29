"use client";
import { LayoutDashboard, Users, Package, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardSidebarProps {
    isCollapsed: boolean;
    isMobile: boolean;
    activeItem: string;
    toggleSidebar: () => void;
    setActiveItem: (item: string) => void;
}

export default function DashboardSidebar({
    isCollapsed,
    isMobile,
    activeItem,
    toggleSidebar,
    setActiveItem
}: DashboardSidebarProps) {
    return (
        <>
            <aside 
                className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
                    ${isCollapsed ? 'w-20' : 'w-64'} 
                    ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'}
                    ${isMobile && isCollapsed ? 'hidden' : ''}
                `}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8">
                        {!isCollapsed && (
                            <div className="text-xl font-bold text-gray-800 dark:text-white">
                                Logo
                            </div>
                        )}
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:block"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                            ) : (
                                <ChevronLeft className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                            )}
                        </button>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => setActiveItem('dashboard')}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        activeItem === 'dashboard' 
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    {!isCollapsed && <span className="ml-3 font-medium">Dashboard</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveItem('customers')}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        activeItem === 'customers' 
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    {!isCollapsed && <span className="ml-3 font-medium">Customers</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveItem('products')}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        activeItem === 'products' 
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Package className="w-5 h-5" />
                                    {!isCollapsed && <span className="ml-3 font-medium">Products</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveItem('settings')}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        activeItem === 'settings' 
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Settings className="w-5 h-5" />
                                    {!isCollapsed && <span className="ml-3 font-medium">Settings</span>}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {isMobile && !isCollapsed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}