"use client";
import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users,
    Package,
    Settings,
    ChevronLeft, 
    ChevronRight,
    BarChart2,
    CreditCard
} from 'lucide-react';
import { useMobileDetection } from '../../../hooks/useMobileDetection';
import { useDarkMode } from '../../../hooks/useDarkMode';
import DashboardNavigation from './dashboard-navigation';


export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    
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

    const handleSignOut = () => {
        console.log('Signing out...');
        setShowProfileDropdown(false);
    };

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
            {/* Top Navigation */}
            <DashboardNavigation 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
                toggleSidebar={toggleSidebar} 
                isCollapsed={isCollapsed} 
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar - Overlay on mobile */}
                <aside 
                    className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
                        ${isCollapsed ? 'w-20' : 'w-64'} 
                        ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'}
                        ${isMobile && isCollapsed ? 'hidden' : ''}
                    `}
                >
                    <div className="flex flex-col h-full p-4">
                        {/* Logo and Toggle */}
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

                        {/* Navigation */}
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

                {/* Overlay for mobile sidebar */}
                {isMobile && !isCollapsed && (
                    <div 
                        className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Main Content */}
                <main className={`flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out`}>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        {activeItem === 'dashboard' ? 'Dashboard Overview' : 
                        activeItem === 'customers' ? 'Customer Management' :
                        activeItem === 'products' ? 'Product Inventory' : 'Settings'}
                    </h1>

                    {/* Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Total Revenue</h3>
                                <CreditCard className="text-blue-500 w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">$24,780</p>
                            <p className="text-sm text-green-500 mt-2">+12% from last month</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Active Users</h3>
                                <Users className="text-green-500 w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">1,429</p>
                            <p className="text-sm text-green-500 mt-2">+8.2% from last month</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Sales Analytics</h3>
                                <BarChart2 className="text-purple-500 w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">$8,240</p>
                            <p className="text-sm text-red-500 mt-2">-2.5% from last month</p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            {activeItem === 'dashboard' ? 'Recent Activity' : 
                            activeItem === 'customers' ? 'Customer List' :
                            activeItem === 'products' ? 'Product Catalog' : 'System Settings'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {activeItem === 'dashboard' ? 'Your recent dashboard activity and statistics will appear here.' : 
                            activeItem === 'customers' ? 'Manage your customer relationships and view customer details.' :
                            activeItem === 'products' ? 'View and manage your product inventory and catalog.' : 'Configure your system settings and preferences.'}
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}