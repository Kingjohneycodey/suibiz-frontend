"use client";
import { Settings, Users, Lock, Mail, AlertCircle, Database, Server, Bell, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        siteName: 'Marketplace Admin',
        adminEmail: 'admin@marketplace.com',
        maintenanceMode: false,
        userRegistration: true,
        emailVerification: true,
        currency: 'SUI',
        sessionTimeout: 30,
        apiRateLimit: 100,
        backupFrequency: 'daily',
        notificationEmails: true,
        securityAlerts: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'general', icon: <Settings size={18} />, label: 'General' },
        { id: 'users', icon: <Users size={18} />, label: 'Users' },
        { id: 'security', icon: <Lock size={18} />, label: 'Security' },
        { id: 'email', icon: <Mail size={18} />, label: 'Email' },
        { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
        { id: 'payments', icon: <CreditCard size={18} />, label: 'Payments' },
        { id: 'advanced', icon: <Server size={18} />, label: 'Advanced' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Admin Settings</h1>
                    <p className="text-gray-500">Configure platform-wide settings and preferences</p>
                </div>

                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab.icon}
                                <span className="ml-2">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                        {activeTab === 'general' && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                                            Site Name
                                        </label>
                                        <input
                                            type="text"
                                            id="siteName"
                                            name="siteName"
                                            value={formData.siteName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                            Default Currency
                                        </label>
                                        <select
                                            id="currency"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="SUI">SUI</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="ETH">ETH</option>
                                            <option value="BTC">BTC</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="maintenanceMode"
                                                    name="maintenanceMode"
                                                    type="checkbox"
                                                    checked={formData.maintenanceMode}
                                                    onChange={handleChange}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                                                    Maintenance Mode
                                                </label>
                                                <p className="text-gray-500">
                                                    When enabled, only administrators can access the site
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="userRegistration"
                                                name="userRegistration"
                                                type="checkbox"
                                                checked={formData.userRegistration}
                                                onChange={handleChange}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="userRegistration" className="font-medium text-gray-700">
                                                Allow New User Registrations
                                            </label>
                                            <p className="text-gray-500">
                                                Disable to prevent new users from signing up
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="emailVerification"
                                                name="emailVerification"
                                                type="checkbox"
                                                checked={formData.emailVerification}
                                                onChange={handleChange}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="emailVerification" className="font-medium text-gray-700">
                                                Require Email Verification
                                            </label>
                                            <p className="text-gray-500">
                                                Users must verify their email before accessing the platform
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                                            Session Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            id="sessionTimeout"
                                            name="sessionTimeout"
                                            min="1"
                                            max="1440"
                                            value={formData.sessionTimeout}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            How long before inactive users are automatically logged out
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="p-6 space-y-6">
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Changing these settings can affect platform security. Make sure you understand the implications before saving changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="apiRateLimit" className="block text-sm font-medium text-gray-700">
                                            API Rate Limit (requests/minute)
                                        </label>
                                        <input
                                            type="number"
                                            id="apiRateLimit"
                                            name="apiRateLimit"
                                            min="1"
                                            max="1000"
                                            value={formData.apiRateLimit}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Maximum API requests allowed per minute per IP address
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Security Headers
                                        </label>
                                        <div className="space-y-2">
                                            {[
                                                'Content Security Policy (CSP)',
                                                'X-Frame-Options',
                                                'Strict-Transport-Security',
                                                'X-Content-Type-Options',
                                                'Referrer-Policy'
                                            ].map(header => (
                                                <div key={header} className="flex items-center">
                                                    <input
                                                        id={`header-${header}`}
                                                        name={`header-${header}`}
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`header-${header}`} className="ml-2 block text-sm text-gray-700">
                                                        {header}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-6 py-3 bg-gray-50 text-right">
                            <button
                                type="button"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Reset to Defaults
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}