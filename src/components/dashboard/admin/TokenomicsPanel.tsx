import { PieChart, BarChart } from 'lucide-react';


export const TokenomicsPanel = () => {
    const tokenData = [
        { name: "Circulating", value: 45, color: "bg-blue-500" },
        { name: "Staked", value: 30, color: "bg-purple-500" },
        { name: "Treasury", value: 15, color: "bg-green-500" },
        { name: "Team", value: 7, color: "bg-yellow-500" },
        { name: "Reserves", value: 3, color: "bg-red-500" },
    ];

    const transactionData = [
        { month: "Jan", volume: 1200000 },
        { month: "Feb", volume: 1800000 },
        { month: "Mar", volume: 1500000 },
        { month: "Apr", volume: 2400000 },
        { month: "May", volume: 2100000 },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Tokenomics Insights</h2>
        
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Distribution */}
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Token Distribution</h3>
                        <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {tokenData.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.name}</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">{item.value}%</span>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Transaction Volume */}
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Monthly Volume (USD)</h3>
                        <BarChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {transactionData.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-10">{item.month}</span>
                                <div className="flex-1 mx-2">
                                    <div 
                                        className="h-4 bg-blue-500 rounded" 
                                        style={{ width: `${(item.volume / 3000000) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    ${(item.volume / 1000000).toFixed(1)}M
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};