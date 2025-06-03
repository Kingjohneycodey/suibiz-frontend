"use client";
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, DollarSign, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';

type Activity = {
  id: number;
  text: string;
  time: string;
  type: 'payment' | 'service' | 'verification' | 'alert';
};

const DashboardOverview = () => {
  // Internal state management
  const balance = 2450.75;
  const pendingOrders = 3;
  const serviceBookings = 2;
  const [activities, setActivities] = useState<Activity[]>([]);
  const balanceChange = 12.5; // percentage change

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
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto dark:bg-gray-900">
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
                <DollarSign className="w-4 h-4" /> Total Balance
              </h3>
              <p className="text-2xl font-bold mt-1 dark:text-gray-300 text-gray-900 dark:text-white">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <p className="text-2xl font-bold mt-1 dark:text-gray-300 text-gray-900 dark:text-white">{pendingOrders}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="text-green-600">+2</span> from yesterday
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

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">At-a-glance performance metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">Avg. Response Time</p>
            <p className="text-xl font-bold mt-1 dark:text-gray-300">2.4h</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">Completion Rate</p>
            <p className="text-xl font-bold mt-1 dark:text-gray-300">98%</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400">Repeat Clients</p>
            <p className="text-xl font-bold mt-1 dark:text-gray-300">72%</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400">Satisfaction</p>
            <p className="text-xl font-bold mt-1 dark:text-gray-300">4.9★</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;