"use client";
import { Users, Activity, Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Download, Box, ShoppingCart, Tag, Calendar } from 'lucide-react';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface User {
    id: string;
    walletAddress: string;
    username: string;
    email: string;
    joinDate: string;
    lastActive: string;
    productsListed: number;
    servicesListed: number;
    purchases: number;
    bookings: number;
    status: 'active' | 'suspended' | 'banned';
    kycVerified: boolean;
    totalSpent: number;
    totalEarned: number;
    avgRating?: number;
}

interface FilterOptions {
    status: string[];
    kycStatus: string[];
    minProducts: string;
    minServices: string;
    minPurchases: string;
    minBookings: string;
}

export default function AdminMarketplaceDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'users' | 'products' | 'services' | 'transactions'>('users');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        status: [],
        kycStatus: [],
        minProducts: '',
        minServices: '',
        minPurchases: '',
        minBookings: ''
    });
    const usersPerPage = 8;
    const exportButtonRef = useRef<HTMLButtonElement>(null);

    const users: User[] = [
        {
        id: '1',
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        username: 'digital_creator',
        email: 'creator@example.com',
        joinDate: '2023-01-15',
        lastActive: '2023-05-20',
        productsListed: 12,
        servicesListed: 3,
        purchases: 8,
        bookings: 2,
        status: 'active',
        kycVerified: true,
        totalSpent: 342.50,
        totalEarned: 1250.75,
        avgRating: 4.7
        },
        {
        id: '2',
        walletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        username: 'service_provider',
        email: 'provider@example.com',
        joinDate: '2023-02-10',
        lastActive: '2023-05-18',
        productsListed: 2,
        servicesListed: 7,
        purchases: 3,
        bookings: 15,
        status: 'active',
        kycVerified: false,
        totalSpent: 89.10,
        totalEarned: 2890.20,
        avgRating: 4.9
        },
        {
        id: '3',
        walletAddress: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
        username: 'frequent_buyer',
        email: 'buyer@example.com',
        joinDate: '2023-03-05',
        lastActive: '2023-05-15',
        productsListed: 0,
        servicesListed: 0,
        purchases: 28,
        bookings: 7,
        status: 'suspended',
        kycVerified: true,
        totalSpent: 1230.75,
        totalEarned: 0,
        avgRating: 4.2
        },
        {
        id: '4',
        walletAddress: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5',
        username: 'premium_seller',
        email: 'premium@example.com',
        joinDate: '2023-01-22',
        lastActive: '2023-05-19',
        productsListed: 45,
        servicesListed: 12,
        purchases: 5,
        bookings: 3,
        status: 'active',
        kycVerified: true,
        totalSpent: 567.80,
        totalEarned: 5670.30,
        avgRating: 4.8
        },
        {
        id: '5',
        walletAddress: '0xBbBBBBBBbBBBbBbbBbbBbbbbBBbBbbbbBbBbbBBb',
        username: 'scammer_alert',
        email: 'scammer@example.com',
        joinDate: '2023-04-01',
        lastActive: '2023-04-15',
        productsListed: 3,
        servicesListed: 2,
        purchases: 0,
        bookings: 0,
        status: 'banned',
        kycVerified: false,
        totalSpent: 0,
        totalEarned: 10.50,
        avgRating: 1.2
        },
        {
        id: '6',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        username: 'new_entrepreneur',
        email: 'newbie@example.com',
        joinDate: '2023-02-28',
        lastActive: '2023-05-21',
        productsListed: 5,
        servicesListed: 1,
        purchases: 12,
        bookings: 4,
        status: 'active',
        kycVerified: true,
        totalSpent: 234.90,
        totalEarned: 450.60,
        avgRating: 3.9
        },
        {
        id: '7',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44f',
        username: 'local_service',
        email: 'local@example.com',
        joinDate: '2023-05-10',
        lastActive: '2023-05-21',
        productsListed: 0,
        servicesListed: 4,
        purchases: 2,
        bookings: 8,
        status: 'active',
        kycVerified: false,
        totalSpent: 45.25,
        totalEarned: 1200.00,
        avgRating: 4.5
        },
        {
        id: '8',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44g',
        username: 'power_user',
        email: 'power@example.com',
        joinDate: '2023-01-05',
        lastActive: '2023-05-20',
        productsListed: 32,
        servicesListed: 8,
        purchases: 45,
        bookings: 12,
        status: 'active',
        kycVerified: true,
        totalSpent: 2456.70,
        totalEarned: 5678.90,
        avgRating: 4.6
        },
        {
        id: '9',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44h',
        username: 'verified_brand',
        email: 'brand@example.com',
        joinDate: '2023-03-15',
        lastActive: '2023-05-19',
        productsListed: 63,
        servicesListed: 5,
        purchases: 3,
        bookings: 2,
        status: 'active',
        kycVerified: true,
        totalSpent: 123.40,
        totalEarned: 12345.60,
        avgRating: 4.9
        },
        {
        id: '10',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44i',
        username: 'test_account',
        email: 'test@example.com',
        joinDate: '2023-05-01',
        lastActive: '2023-05-15',
        productsListed: 1,
        servicesListed: 0,
        purchases: 2,
        bookings: 0,
        status: 'suspended',
        kycVerified: false,
        totalSpent: 12.30,
        totalEarned: 0,
        avgRating: 3.0
        }
    ];

    const handleFilterChange = (field: keyof FilterOptions, value: string | string[]) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            status: [],
            kycStatus: [],
            minProducts: '',
            minServices: '',
            minPurchases: '',
            minBookings: ''
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filters.status.length === 0 || filters.status.includes(user.status);
        
        const matchesKYC = filters.kycStatus.length === 0 || 
            (filters.kycStatus.includes('verified') && user.kycVerified) ||
            (filters.kycStatus.includes('pending') && !user.kycVerified);
        
        const matchesProducts = !filters.minProducts || user.productsListed >= parseInt(filters.minProducts);
        const matchesServices = !filters.minServices || user.servicesListed >= parseInt(filters.minServices);
        const matchesPurchases = !filters.minPurchases || user.purchases >= parseInt(filters.minPurchases);
        const matchesBookings = !filters.minBookings || user.bookings >= parseInt(filters.minBookings);

        return matchesSearch && matchesStatus && matchesKYC && matchesProducts && 
            matchesServices && matchesPurchases && matchesBookings;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const activeUsers = users.filter(user => user.status === 'active').length;
    const totalProductsListed = users.reduce((sum, user) => sum + user.productsListed, 0);
    const totalServicesListed = users.reduce((sum, user) => sum + user.servicesListed, 0);
    const totalTransactions = users.reduce((sum, user) => sum + user.purchases + user.bookings, 0);
    const totalVolume = users.reduce((sum, user) => sum + user.totalSpent, 0);
    const totalEarnings = users.reduce((sum, user) => sum + user.totalEarned, 0);

    const exportToExcel = () => {
        // Prepare data for export
        const exportData = filteredUsers.map(user => ({
            Username: user.username,
            Email: user.email,
            'Wallet Address': user.walletAddress,
            Status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
            'Join Date': user.joinDate,
            'Last Active': user.lastActive,
            'Products Listed': user.productsListed,
            'Services Listed': user.servicesListed,
            Purchases: user.purchases,
            Bookings: user.bookings,
            'Total Spent (SUI)': user.totalSpent.toFixed(2),
            'Total Earned (SUI)': user.totalEarned.toFixed(2),
            'KYC Verified': user.kycVerified ? 'Yes' : 'No',
            'Average Rating': user.avgRating?.toFixed(1) || 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        
        XLSX.writeFile(wb, `marketplace_users_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="dark:bg-gray-900">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Active Users</dt>
                            <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{activeUsers}</div>
                            </dd>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <Box className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Products Listed</dt>
                            <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{totalProductsListed}</div>
                            </dd>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <Tag className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Services Listed</dt>
                            <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{totalServicesListed}</div>
                            </dd>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Total Transactions</dt>
                            <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{totalTransactions}</div>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">({totalVolume.toFixed(2)} SUI)</span>
                            </dd>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                            }}
                        />
                        </div>
                        
                        <div className="flex space-x-3">
                        <div className="relative">
                            <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                            {Object.values(filters).some(filter => 
                                Array.isArray(filter) ? filter.length > 0 : filter !== ''
                            ) && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-500 rounded-full">
                                {[
                                    filters.status.length,
                                    filters.kycStatus.length,
                                    filters.minProducts ? 1 : 0,
                                    filters.minServices ? 1 : 0,
                                    filters.minPurchases ? 1 : 0,
                                    filters.minBookings ? 1 : 0
                                ].reduce((a, b) => a + b, 0)}
                                </span>
                            )}
                            </button>
                            
                            {showFilters && (
                            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-4 px-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Filter Users</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <div className="space-y-2">
                                    {['active', 'suspended', 'banned'].map(status => (
                                        <div key={status} className="flex items-center">
                                        <input
                                            id={`status-${status}`}
                                            name="status"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                                            checked={filters.status.includes(status)}
                                            onChange={(e) => {
                                            const newStatus = e.target.checked
                                                ? [...filters.status, status]
                                                : filters.status.filter(s => s !== status);
                                            handleFilterChange('status', newStatus);
                                            }}
                                        />
                                        <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {status}
                                        </label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KYC Status</label>
                                    <div className="space-y-2">
                                    {['verified', 'pending'].map(kyc => (
                                        <div key={kyc} className="flex items-center">
                                        <input
                                            id={`kyc-${kyc}`}
                                            name="kycStatus"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                                            checked={filters.kycStatus.includes(kyc)}
                                            onChange={(e) => {
                                            const newKYC = e.target.checked
                                                ? [...filters.kycStatus, kyc]
                                                : filters.kycStatus.filter(k => k !== kyc);
                                            handleFilterChange('kycStatus', newKYC);
                                            }}
                                        />
                                        <label htmlFor={`kyc-${kyc}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {kyc}
                                        </label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                    <label htmlFor="minProducts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Products</label>
                                    <input
                                        type="number"
                                        id="minProducts"
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
                                        value={filters.minProducts}
                                        onChange={(e) => handleFilterChange('minProducts', e.target.value)}
                                        min="0"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="minServices" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Services</label>
                                    <input
                                        type="number"
                                        id="minServices"
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
                                        value={filters.minServices}
                                        onChange={(e) => handleFilterChange('minServices', e.target.value)}
                                        min="0"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="minPurchases" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Purchases</label>
                                    <input
                                        type="number"
                                        id="minPurchases"
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
                                        value={filters.minPurchases}
                                        onChange={(e) => handleFilterChange('minPurchases', e.target.value)}
                                        min="0"
                                    />
                                    </div>
                                    <div>
                                    <label htmlFor="minBookings" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Bookings</label>
                                    <input
                                        type="number"
                                        id="minBookings"
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-white"
                                        value={filters.minBookings}
                                        onChange={(e) => handleFilterChange('minBookings', e.target.value)}
                                        min="0"
                                    />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={resetFilters}
                                    >
                                    Reset
                                    </button>
                                    <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setShowFilters(false)}
                                    >
                                    Apply
                                    </button>
                                </div>
                                </div>
                            </div>
                            )}
                        </div>
                        
                        <button 
                            ref={exportButtonRef}
                            onClick={exportToExcel}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </button>
                        </div>
                    </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            SUI Wallet
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Products
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Services
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Purchases
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Bookings
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Balance (SUI)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            KYC
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <span className="text-indigo-600 dark:text-indigo-200 font-medium">
                                    {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    {user.avgRating && (
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-3 w-3 ${i < Math.floor(user.avgRating!) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        ))}
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{user.avgRating.toFixed(1)}</span>
                                    </div>
                                    )}
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white font-mono">
                                {`${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Joined {user.joinDate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${user.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                                user.status === 'suspended' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
                                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                <Box className="h-4 w-4 text-gray-400 mr-1" />
                                {user.productsListed}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                <Tag className="h-4 w-4 text-gray-400 mr-1" />
                                {user.servicesListed}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                <ShoppingCart className="h-4 w-4 text-gray-400 mr-1" />
                                {user.purchases}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                {user.bookings}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex flex-col">
                                <span className="font-medium dark:text-white">Spent: {user.totalSpent.toFixed(2)}</span>
                                <span className="text-green-600 dark:text-green-400">Earned: {user.totalEarned.toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.kycVerified ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    Verified
                                </span>
                                ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300">
                                    Pending
                                </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="relative inline-block text-left">
                                <div>
                                    <button 
                                    type="button" 
                                    className="inline-flex justify-center w-full rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                                    id="options-menu"
                                    >
                                    <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </main>
            </div>
        </div>
    );
}