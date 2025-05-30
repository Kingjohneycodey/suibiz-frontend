import { Flag, User, Trash2, Eye, Check } from 'lucide-react';


export const FlaggedContentPanel = () => {
    const flaggedItems = [
        { 
            id: "FC-001", 
            content: "Inappropriate profile image", 
            type: "profile", 
            user: "user123", 
            reporter: "moderator02",
            status: "pending"
        },
        { 
            id: "FC-002", 
            content: "Spam message in chat", 
            type: "message", 
            user: "spammer99", 
            reporter: "user456",
            status: "pending"
        },
        { 
            id: "FC-003", 
            content: "Fake service listing", 
            type: "service", 
            user: "scammer01", 
            reporter: "user789",
            status: "resolved"
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Flagged Content</h2>
        
            <div className="space-y-4">
                {flaggedItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-500 dark:text-red-400">
                        <Flag className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{item.content}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <User className="w-3 h-3 mr-1" /> {item.user}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Type: {item.type}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Reported by: {item.reporter}</span>
                        </div>
                    </div>
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                    {item.status === "pending" ? (
                        <>
                        <button className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg flex items-center hover:bg-green-200 dark:hover:bg-green-800">
                            <Check className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg flex items-center hover:bg-red-200 dark:hover:bg-red-800">
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                        </>
                    ) : (
                        <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg">
                        Resolved
                        </span>
                    )}
                    <button className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-lg flex items-center hover:bg-blue-200 dark:hover:bg-blue-800">
                        <Eye className="w-4 h-4 mr-1" /> View
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};