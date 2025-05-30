"use client";
import React, { useState, useEffect } from 'react';
import { FiPackage, FiSearch, FiChevronDown, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    items: number;
    total: number;
    delivery: string;
    tracking: string;
    itemsDetail: OrderItem[];
}

const statusStyles: Record<OrderStatus, { bg: string; text: string; icon: React.ReactElement }> = {
    processing: {
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        text: 'text-orange-600 dark:text-orange-400',
        icon: <FiClock className="text-orange-600 dark:text-orange-400" />
    },
    shipped: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        icon: <FiTruck className="text-blue-600 dark:text-blue-400" />
    },
    delivered: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        icon: <FiCheckCircle className="text-green-600 dark:text-green-400" />
    },
    cancelled: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        icon: <FiXCircle className="text-red-600 dark:text-red-400" />
    }
};

const statusText: Record<OrderStatus, string> = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

const OrdersDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({ 
        key: 'date', 
        direction: 'desc' 
    });

    // Load sample data
    useEffect(() => {
        const sampleOrders: Order[] = [
            {
                id: 'ORD-78945',
                date: '2023-06-15',
                status: 'delivered',
                items: 3,
                total: 149.99,
                delivery: 'FedEx 2-Day',
                tracking: '934857634985',
                itemsDetail: [
                    { name: 'Wireless Headphones', price: 89.99, quantity: 1 },
                    { name: 'Phone Case', price: 29.99, quantity: 2 }
                ]
            },
            {
                id: 'ORD-78123',
                date: '2023-06-10',
                status: 'shipped',
                items: 2,
                total: 75.50,
                delivery: 'USPS Priority',
                tracking: '920384756123',
                itemsDetail: [
                    { name: 'Smart Watch', price: 65.50, quantity: 1 },
                    { name: 'Screen Protector', price: 10.00, quantity: 1 }
                ]
            },
            {
                id: 'ORD-77654',
                date: '2023-06-05',
                status: 'processing',
                items: 1,
                total: 45.00,
                delivery: 'Standard Shipping',
                tracking: '',
                itemsDetail: [
                    { name: 'Bluetooth Speaker', price: 45.00, quantity: 1 }
                ]
            },
            {
                id: 'ORD-77231',
                date: '2023-05-28',
                status: 'cancelled',
                items: 2,
                total: 120.00,
                delivery: '',
                tracking: '',
                itemsDetail: [
                    { name: 'Fitness Tracker', price: 80.00, quantity: 1 },
                    { name: 'Yoga Mat', price: 40.00, quantity: 1 }
                ]
            }
        ];
        
        setOrders(sampleOrders);
        setFilteredOrders(sampleOrders);
    }, []);

    useEffect(() => {
        let result = [...orders];
        
        if (activeTab !== 'all') {
            result = result.filter(order => order.status === activeTab);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order.id.toLowerCase().includes(query) ||
                order.delivery?.toLowerCase().includes(query) ||
                order.tracking?.toLowerCase().includes(query) ||
                order.itemsDetail.some(item => item.name.toLowerCase().includes(query))
            );
        }
        
        result.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        setFilteredOrders(result);
    }, [orders, activeTab, searchQuery, sortConfig]);

    const requestSort = (key: keyof Order) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleOrderExpand = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const SortIcon = ({ column }: { column: keyof Order }) => {
        if (sortConfig.key !== column) return <FiArrowUp className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <FiPackage className="text-purple-600 dark:text-purple-400 text-2xl" />
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Orders</h1>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {filteredOrders.length} orders
                        </span>
                    </div>
                
                    <div className="flex w-full sm:w-auto gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <div className="flex">
                        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                                    activeTab === tab
                                        ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'all' ? 'All Orders' : statusText[tab as OrderStatus]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {[
                                        { key: 'id', label: 'Order ID' },
                                        { key: 'date', label: 'Date' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'items', label: 'Items' },
                                        { key: 'total', label: 'Total' },
                                        { key: 'delivery', label: 'Delivery' },
                                        { label: 'Tracking' }
                                    ].map((header) => (
                                        <th
                                            key={header.key || header.label}
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                                                header.key ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                            }`}
                                            onClick={() => header.key && requestSort(header.key as keyof Order)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header.label}
                                                {header.key && <SortIcon column={header.key as keyof Order} />}
                                            </div>
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <tr 
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => toggleOrderExpand(order.id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(order.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                                                        {statusStyles[order.status].icon}
                                                        {statusText[order.status]}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {order.items}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {order.delivery || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {order.tracking ? (
                                                        <a
                                                            href={`https://tracking.com/${order.tracking}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            {order.tracking}
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleOrderExpand(order.id);
                                                        }}
                                                    >
                                                        {expandedOrder === order.id ? (
                                                            <FiChevronDown className="text-gray-400" />
                                                        ) : (
                                                            <FiChevronRight className="text-gray-400" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedOrder === order.id && (
                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                    <td colSpan={8} className="px-6 py-4">
                                                        <div className="pl-12 pr-4">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                                                            <div className="space-y-3 mb-4">
                                                                {order.itemsDetail.map((item, index) => (
                                                                    <div key={index} className="flex justify-between text-sm">
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {item.quantity}x {item.name}
                                                                        </span>
                                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                                            ${item.price.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3 text-sm font-medium">
                                                                <span className="text-gray-900 dark:text-white">Total:</span>
                                                                <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FiPackage className="h-12 w-12 mb-3" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                                                <p className="mt-1 dark:text-gray-400">We could not find any orders matching your criteria.</p>
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('all');
                                                        setSearchQuery('');
                                                    }}
                                                    className="mt-4 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg font-medium"
                                                >
                                                    Reset all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile List */}
                <div className="md:hidden">
                    {filteredOrders.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="p-4">
                                    <div 
                                        className="flex justify-between items-start cursor-pointer"
                                        onClick={() => toggleOrderExpand(order.id)}
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(order.date)}</div>
                                        </div>
                                        <button className="p-1">
                                            {expandedOrder === order.id ? (
                                                <FiChevronDown className="text-gray-400" />
                                            ) : (
                                                <FiChevronRight className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-between items-center">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                                            {statusStyles[order.status].icon}
                                            {statusText[order.status]}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{order.items} {order.items > 1 ? 'items' : 'item'}</div>
                                            <div className="font-medium dark:text-white">${order.total.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    
                                    {expandedOrder === order.id && (
                                        <div className="mt-4 pl-2">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Details</h4>
                                            <div className="space-y-3 mb-4">
                                                {order.itemsDetail.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.tracking && (
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tracking:</div>
                                                    <a
                                                        href={`https://tracking.com/${order.tracking}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                                    >
                                                        {order.delivery} #{order.tracking}
                                                    </a>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3 text-sm font-medium">
                                                <span className="text-gray-900 dark:text-white">Total:</span>
                                                <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <FiPackage className="h-12 w-12 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                                <p className="mt-1 dark:text-gray-400">We could not find any orders matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setActiveTab('all');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg font-medium"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersDashboard;