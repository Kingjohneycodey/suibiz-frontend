"use client";
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { FiPackage, FiCheckCircle, FiTruck, FiClock, FiSearch, FiFilter, FiUser, FiX, FiShoppingBag } from 'react-icons/fi';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    id: string;
    productName: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
}

const OrdersManagement = () => {
   const currentAccount = useCurrentAccount();

        useEffect(() => {
            console.log('Current wallet connection status:', {
                currentAccount
            });
        }, [currentAccount]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: '#ORD-001',
            customerName: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            date: '2023-05-15',
            status: 'processing',
            total: 124.99,
            paymentMethod: 'Credit Card',
            items: [
                {
                    id: '1',
                    productName: 'Wireless Headphones Pro X',
                    price: 99.99,
                    quantity: 1,
                },
                {
                    id: '2',
                    productName: 'USB-C Fast Charging Cable',
                    price: 12.50,
                    quantity: 2,
                },
            ],
        },
        {
            id: '#ORD-002',
            customerName: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            phone: '+1 (555) 987-6543',
            address: '456 Oak Ave, Los Angeles, CA 90015',
            date: '2023-05-14',
            status: 'pending',
            total: 45.99,
            paymentMethod: 'PayPal',
            items: [
                {
                    id: '3',
                    productName: 'Premium Smart Watch Band',
                    price: 45.99,
                    quantity: 1,
                },
            ],
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        document.body.style.overflow = 'auto';
    };



    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-800';
            case 'processing': return 'bg-blue-50 text-blue-800';
            case 'shipped': return 'bg-indigo-50 text-indigo-800';
            case 'delivered': return 'bg-green-50 text-green-800';
            case 'cancelled': return 'bg-red-50 text-red-800';
            default: return 'bg-gray-50 text-gray-800';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <FiClock className="mr-1.5" />;
            case 'processing': return <FiPackage className="mr-1.5" />;
            case 'shipped': return <FiTruck className="mr-1.5" />;
            case 'delivered': return <FiCheckCircle className="mr-1.5" />;
            case 'cancelled': return <FiX className="mr-1.5" />;
            default: return <FiClock className="mr-1.5" />;
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h1>
                    <p className="text-gray-600 mt-1">View and manage customer orders</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center">
                            <FiFilter className="text-gray-400 mr-2" />
                            <select
                                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td 
                                            className="px-4 py-4 whitespace-nowrap cursor-pointer"
                                            onClick={() => openOrderDetails(order)}
                                        >
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-sm text-gray-500">{order.email}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex items-center text-xs leading-4 font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => openOrderDetails(order)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                            <select
                                                className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-sm"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search or filter to find what you are looking for.
                            </p>
                        </div>
                    )}
                </div>

                {isModalOpen && selectedOrder && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black/60 bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
                            onClick={closeModal}
                        ></div>
                        
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                            <div 
                                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="overflow-y-auto px-6 pt-6 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                Order Details: {selectedOrder.id}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <FiX className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <div className="flex items-center mb-4">
                                                <FiUser className="text-gray-400 mr-2" />
                                                <h4 className="text-base font-semibold text-gray-900">Customer Information</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500">Name</p>
                                                    <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="text-sm font-medium">{selectedOrder.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="text-sm font-medium">{selectedOrder.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="text-sm font-medium">{selectedOrder.address}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-5 rounded-lg">
                                            <div className="flex items-center mb-4">
                                                <FiShoppingBag className="text-gray-400 mr-2" />
                                                <h4 className="text-base font-semibold text-gray-900">Order Summary</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-4 font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                        {getStatusIcon(selectedOrder.status)}
                                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-sm text-gray-500">Payment Method</p>
                                                    <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-sm text-gray-500">Total Amount</p>
                                                    <p className="text-sm font-medium">${selectedOrder.total.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="text-base font-semibold text-gray-900 mb-4">Order Items</h4>
                                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedOrder.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {item.productName}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                ${item.price.toFixed(2)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                        Showing <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
                    </p>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;