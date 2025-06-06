"use client";
import { useState, useEffect, useMemo } from 'react';
import { ArrowDown, ArrowUp, Search, Filter, ChevronDown, Plus, Minus, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Transaction, UserWalletProps } from '../../../../types/wallet';


const UserWallet = ({ transactions, balance }: UserWalletProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
    type StatusFilter = 'all' | 'completed' | 'pending';

    const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(tx => 
                tx.invoiceId.toLowerCase().includes(term) ||
                tx.name.toLowerCase().includes(term) ||
                tx.amount.toString().includes(term) ||
                tx.date.includes(term) ||
                tx.currency.toLowerCase().includes(term) ||
                tx.status.toLowerCase().includes(term)
            );
        }
        
        if (filterStatus !== 'all') {
            filtered = filtered.filter(tx => tx.status === filterStatus);
        }
        
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return filtered;
    }, [transactions, searchTerm, filterStatus, sortConfig]);

    const requestSort = (key: keyof Transaction) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeposit = () => {
        // Implement actual deposit logic
        console.log('Deposit initiated');
    };

    const handleWithdraw = () => {
        // Implement actual withdrawal logic
        console.log('Withdrawal initiated');
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-6 sm:p-6 max-w-7xl mx-auto dark:bg-gray-900 ">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track your transactions and manage funds</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                <button 
                    onClick={handleDeposit}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Deposit</span>
                </button>
                <button 
                    onClick={handleWithdraw}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 w-full sm:w-auto border dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                    <Minus className="w-5 h-5" />
                    <span>Withdraw</span>
                </button>
                </div>
            </div>
        
            <div className="bg-gradient-to-r from-purple-900 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-medium opacity-80">Total Balance</h2>
                    <p className="text-3xl font-bold mt-1">{(balance).toFixed(2)} SUI</p>
                    <p className="text-sm opacity-80 mt-2">Equivalent to {(balance / 1.25).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <Image 
                        src="/sui-logo.png" 
                        alt="SUI" 
                        width={40} 
                        height={40} 
                        className="opacity-90"
                    />
                </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filterStatus === 'all' ? 'All' : filterStatus} transactions
                    {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400 w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white/90 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="text-gray-400 w-5 h-5" />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                            className="block w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                            <option value="all" className='dark:text-white/90'>All Statuses</option>
                            <option value="completed" className='dark:text-white/90'>Completed</option>
                            <option value="pending" className='dark:text-white/90'>Pending</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center p-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'No transactions match your search' : 'No transactions found'}
                        </p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => requestSort('invoiceId')}
                            >
                                <div className="flex items-center">
                                Invoice ID
                                {sortConfig?.key === 'invoiceId' && (
                                    <span className="ml-1">
                                    {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </span>
                                )}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => requestSort('name')}
                            >
                                <div className="flex items-center">
                                Description
                                {sortConfig?.key === 'name' && (
                                    <span className="ml-1">
                                    {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </span>
                                )}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => requestSort('date')}
                            >
                                <div className="flex items-center">
                                Date
                                {sortConfig?.key === 'date' && (
                                    <span className="ml-1">
                                    {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </span>
                                )}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => requestSort('amount')}
                            >
                                <div className="flex items-center">
                                Amount
                                {sortConfig?.key === 'amount' && (
                                    <span className="ml-1">
                                    {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </span>
                                )}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => requestSort('status')}
                            >
                                <div className="flex items-center">
                                Status
                                {sortConfig?.key === 'status' && (
                                    <span className="ml-1">
                                    {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </span>
                                )}
                                </div>
                            </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {tx.invoiceId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg mr-3 ${
                                    tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                                    tx.type === 'withdrawal' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                                    'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'
                                    }`}>
                                    {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> : 
                                    tx.type === 'withdrawal' ? <Minus className="w-4 h-4" /> : 
                                    <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{tx.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{tx.type}</div>
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(tx.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`flex items-center text-sm ${
                                    tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' :
                                    tx.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' :
                                    'text-purple-600 dark:text-purple-400'
                                }`}>
                                    {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                                    {tx.amount.toLocaleString()}
                                    <span className="ml-1 flex items-center">
                                    {tx.currency === 'SUI' ? (
                                        <Image 
                                        src="/sui-logo.png" 
                                        alt="SUI" 
                                        width={16} 
                                        height={16} 
                                        className="inline-block"
                                        />
                                    ) : (
                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded ml-1">
                                        USDC
                                        </span>
                                    )}
                                    </span>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    tx.status === 'completed' 
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                    }`}>
                                    {tx.status === 'completed' ? (
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : (
                                        <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    {tx.status}
                                    </span>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserWallet;