import { Activity, ArrowUpRight, FileText, Flag, Users, Zap } from 'lucide-react';

export const AdminOverview = () => {
    const platformStats = [
        { title: "Total Users", value: "12,845", change: "+12%", icon: <Users className="w-5 h-5" />, color: "text-blue-500" },
        { title: "Active DAOs", value: "327", change: "+5%", icon: <Activity className="w-5 h-5" />, color: "text-purple-500" },
        { title: "Daily Transactions", value: "8,492", change: "+23%", icon: <ArrowUpRight className="w-5 h-5" />, color: "text-green-500" },
        { title: "Flagged Content", value: "42", change: "-8%", icon: <Flag className="w-5 h-5" />, color: "text-red-500" },
        { title: "Active Proposals", value: "19", change: "+3", icon: <FileText className="w-5 h-5" />, color: "text-yellow-500" },
        { title: "Token Volume", value: "$4.2M", change: "+17%", icon: <Zap className="w-5 h-5" />, color: "text-indigo-500" },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 h-screen shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {platformStats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</p>
                                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                                    {stat.change} from last week
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};