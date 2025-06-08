"use client";
import { Button } from '@/components/ui/button';
import { fetchUserOrders } from '@/services/orders';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FiPackage, FiSearch, FiChevronDown, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { TransactionBlock } from '@mysten/sui.js/transactions';

type OrderStatus = 'paid' | 'received' | 'delivered' | 'cancelled';

interface Order {
    order_id: string;
    timestamp: string;
    escrow: {
        amount: number;
    };
    data: {
        status: OrderStatus;
        items: string[]
    };
    product: {
        name: string;
        photo: string;
    };
}

const statusStyles: Record<OrderStatus, { bg: string; text: string; icon: React.ReactElement }> = {
    paid: {
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        text: 'text-orange-600 dark:text-orange-400',
        icon: <FiClock className="text-orange-600 dark:text-orange-400" />
    },
    received: {
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
    paid: 'Paid',
    received: 'Received',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

const OrdersDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [order, setOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({
        key: 'timestamp',
        direction: 'desc'
    });
    const account = useCurrentAccount()
    const [showDialog, setShowDialog] = useState(false);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllOrder = async () => {

            const data = await fetchUserOrders(account?.address || "");

            setOrders(data.orders as any[]);
            setFilteredOrders(data.orders as any[]);
        };

        fetchAllOrder();
    }, [account, order]);

    useEffect(() => {
        let result = [...orders];

        if (activeTab !== 'all') {
            result = result.filter(order => order.data.status === activeTab);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.order_id.toLowerCase().includes(query) ||
                order.product.name.toLowerCase().includes(query) ||
                order.data.status?.toLowerCase().includes(query)
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

      const handleConfirmOrder = async (): Promise<void> => {
    setLoading(true);

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::mark_received`,
        arguments: [
          tx.object(order || ""),
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: "sui:testnet",
        },
        {
          onSuccess: () => {
            toast.success("Order confirmed as received successfully!");

            setLoading(false);

            setShowDialog(false)

            setOrder(null)

            // router.push("/business/products")
          },
          onError: (err: { message: string }) => {
            if (
              err.message == "No valid gas coins found for the transaction."
            ) {
              toast.error(
                err.message + "Fund your sui wallet account and try agains"
              );
            } else {
              toast.error(err.message);
            }

            setLoading(false);

            console.error("Transaction Error:", err.message);
          },
        }
      );
    } catch (err) {
      console.error("Error preparing transaction:", err);
    }
  };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8 h-full dark:bg-gray-900">
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
                        {['all', 'paid', 'received', 'delivered', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${activeTab === tab
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
                                        { key: 'photo', label: 'Photo' },
                                        { key: 'id', label: 'Order ID' },
                                        { key: 'name', label: 'Product Name' },
                                        { key: 'date', label: 'Date' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'items', label: 'Items' },
                                        { key: 'total', label: 'Total' },
                                        { key: 'action', label: 'Action' },
                                    ].map((header) => (
                                        <th
                                            key={header.key || header.label}
                                            scope="col"
                                            className={`px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${header.key ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                                }`}
                                            onClick={() => header.key && requestSort(header.key as keyof Order)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header.label}
                                                {header.key && <SortIcon column={header.key as keyof Order} />}
                                            </div>
                                        </th>
                                    ))}
                                    <th scope="col" className="px-2 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <React.Fragment key={order.order_id}>
                                            <tr
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"

                                            >
                                                <div className="ml-4 mt-2 h-10 w-10" onClick={() => toggleOrderExpand(order.order_id)}>
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={order.product.photo}
                                                        alt={order.product.name}
                                                    />
                                                </div>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white" onClick={() => toggleOrderExpand(order.order_id)}>
                                                    {order.order_id.slice(0, 9)}...
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" onClick={() => toggleOrderExpand(order.order_id)}>
                                                    {order.product.name || ''}
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(order.timestamp)}
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.data?.status]?.bg} ${statusStyles[order.data.status]?.text}`}>
                                                        {statusStyles[order.data.status]?.icon}
                                                        {statusText[order.data.status]}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {order.data.items.length}
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {((order.escrow.amount) / 1000000000).toFixed(7)} SUI
                                                </td>
                                                <td>
                                                    <Button disabled={order.data.status !== "paid"} className='bg-green-500 text-white hover:bg-green-600' onClick={() => {
                                                        setOrder(order.order_id)
                                                        setShowDialog(true)
                                                    }} >{order.data.status !== "paid" ? "Confirmed" : "Confirm"}</Button>
                                                </td>

                                                <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleOrderExpand(order.order_id);
                                                        }}
                                                    >
                                                        {expandedOrder === order.order_id ? (
                                                            <FiChevronDown className="text-gray-400" />
                                                        ) : (
                                                            <FiChevronRight className="text-gray-400" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedOrder === order.order_id && (
                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                    <td colSpan={8} className="px-2 py-4">
                                                        <div className="pl-12 pr-4">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                                                            <div className="space-y-3 mb-4">
                                                                {order.data.items.map((item, index) => (
                                                                    <div key={index} className="flex justify-between text-sm">
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {item.slice(0, 9)}...
                                                                        </span>
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {(((order.escrow.amount) / 1000000000) / order.data.items.length).toFixed(7)} SUI
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3 text-sm font-medium">
                                                                <span className="text-gray-900 dark:text-white">Total:</span>
                                                                <span className="text-gray-900 dark:text-white">{((order.escrow.amount) / 1000000000).toFixed(7)} SUI</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-2 py-12 text-center">
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
                                <div key={order.order_id} className="p-4">
                                    <div
                                        className="flex justify-between items-start cursor-pointer"
                                        onClick={() => toggleOrderExpand(order.order_id)}
                                    >
                                        <div>

                                            <div className="font-medium text-gray-900 dark:text-white">           {order.product.name || ''}</div>

                                            <div className="font-medium text-gray-900 dark:text-white">{order.order_id.slice(0, 20)}...
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(order.timestamp)}</div>
                                        </div>
                                        <button className="p-1">
                                            {expandedOrder === order.order_id ? (
                                                <FiChevronDown className="text-gray-400" />
                                            ) : (
                                                <FiChevronRight className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.data.status]?.bg} ${statusStyles[order.data.status]?.text}`}>
                                            {statusStyles[order.data.status]?.icon}
                                            {statusText[order.data.status]}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400"> {order.data.items.length} {order.data.items.length > 1 ? 'items' : 'item'}</div>
                                            <div className="font-medium dark:text-white">{((order.escrow.amount) / 1000000000).toFixed(7)} SUI</div>
                                        </div>
                                    </div>

                                      <div className='mt-4'>
                                                    <Button disabled={order.data.status !== "paid"} className='bg-green-500 text-white hover:bg-green-600' onClick={() => {
                                                        setOrder(order.order_id)
                                                        setShowDialog(true)
                                                    }} >{order.data.status !== "paid" ? "Confirmed" : "Confirm"}</Button>
                                                </div>

                                    {expandedOrder === order.order_id && (
                                        <div className="mt-4 pl-2">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Details</h4>
                    

                                            <div className="space-y-3 mb-4">
                                                {order.data.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {item.slice(0, 20)}...
                                                        </span>
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {(((order.escrow.amount) / 1000000000) / order.data.items.length).toFixed(7)} SUI
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3 text-sm font-medium">
                                                <span className="text-gray-900 dark:text-white">Total:</span>
                                                <span className="text-gray-900 dark:text-white">{((order.escrow.amount) / 1000000000).toFixed(7)} SUI</span>
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

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent
                        className="sm:max-w-[425px] bg-white transition-opacity duration-300"
                        style={{
                            opacity: showDialog ? 1 : 0,
                            transition: "opacity 300ms",
                            transform: showDialog ? "translateY(0)" : "translateY(-20px)"
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Confirm your Order</DialogTitle>
                            <DialogDescription>
                        Are you sure you want to confirm this order as received?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer mt-8"
                                onClick={() => {
                                    setLoading(true);
                                    handleConfirmOrder();
                                }}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Confirm Order"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default OrdersDashboard;