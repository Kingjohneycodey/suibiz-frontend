"use client";
import { BarChart2, CreditCard, Users } from 'lucide-react';

interface DashboardContentProps {
    activeItem: string;
}

export default function DashboardContent({ activeItem }: DashboardContentProps) {
    return (
        <main className={`flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out`}>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {activeItem === 'dashboard' ? 'Dashboard Overview' : 
                activeItem === 'customers' ? 'Customer Management' :
                activeItem === 'products' ? 'Product Inventory' : 'Settings'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Total Revenue</h3>
                        <CreditCard className="text-blue-500 w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$24,780</p>
                    <p className="text-sm text-green-500 mt-2">+12% from last month</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Active Users</h3>
                        <Users className="text-green-500 w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,429</p>
                    <p className="text-sm text-green-500 mt-2">+8.2% from last month</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Sales Analytics</h3>
                        <BarChart2 className="text-purple-500 w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$8,240</p>
                    <p className="text-sm text-red-500 mt-2">-2.5% from last month</p>
                </div>
            </div>

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
    );
}