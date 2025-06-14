"use client";
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, DollarSign, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useCurrentWallet } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { fetchUserPendingOrders } from '@/services/orders';

type Activity = {
  id: number;
  text: string;
  time: string;
  type: 'payment' | 'service' | 'verification' | 'alert';
};

const DashboardOverview = () => {
  // Internal state management
  const serviceBookings = 0;
  const [activities, setActivities] = useState<Activity[]>([]);
  const balanceChange = 1; // percentage change

  useEffect(() => {
    setTimeout(() => {
      setActivities([
        { 
          id: 1, 
          text: 'New service request from Sarah Miller', 
          time: '2 hours ago',
          type: 'service'
        },
        { 
          id: 2, 
          text: 'Payment of $320 received for order #1234', 
          time: '1 day ago',
          type: 'payment'
        },
        { 
          id: 3, 
          text: 'Your professional credential was verified', 
          time: '3 days ago',
          type: 'verification'
        },
        { 
          id: 4, 
          text: 'System maintenance scheduled for tomorrow', 
          time: '4 days ago',
          type: 'alert'
        },
      ]);
    }, 500);
  }, []);

  const [balance, setBalance] = useState(0);

  const [pendingOrders, setPendingOrders] = useState(0)
      
  const { currentWallet } = useCurrentWallet()

  const currentAccount = currentWallet?.accounts[0]?.address

  const client = new SuiClient({ url: getFullnodeUrl('testnet') });
  
  useEffect(() => {
      const fetchBalance = async () => {
          console.log(currentWallet)
          if (!currentAccount) return;

          const data = await client.getBalance({
              owner: currentAccount || "",
          });

          setBalance(Number(data.totalBalance)/1000000000)

          console.log('💰 SUI Balance:', data.totalBalance);
      };

      fetchBalance();
  }, [currentAccount]);

      useEffect(() => {
          const fetchPendingOrder = async () => {
  
              const data = await fetchUserPendingOrders(currentAccount || "");
  
              setPendingOrders(data || 0);
          };
  
          fetchPendingOrder();
      }, [currentAccount]);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'service':
        return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
               <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                SUI Total Balance
              </h3>
              <p className="text-2xl font-bold mt-1 dark:text-gray-300 text-gray-900">
              {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>SUI</small>
              </p>
              <div className={`flex items-center mt-2 text-sm ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {balanceChange >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(balanceChange)}% from last week
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Image 
                src="/sui-logo.png" 
                alt="SUI" 
                width={32} 
                height={32} 
                className="opacity-90"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" /> Pending Orders
              </h3>
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{pendingOrders}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-green-600">+0</span> from yesterday
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Service Bookings
              </h3>
              <p className="text-2xl font-bold mt-1 dark:text-gray-300 text-gray-900 dark:text-white">{serviceBookings}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-blue-600">1 new</span> this week
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your latest notifications and updates</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div className="mt-0.5">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default DashboardOverview;