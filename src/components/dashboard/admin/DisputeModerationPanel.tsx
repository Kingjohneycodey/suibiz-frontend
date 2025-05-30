import { AlertTriangle, Gavel, CheckCircle2, XCircle } from 'lucide-react';


export const DisputeModerationPanel = () => {
    const disputes = [
        { 
            id: "DIS-001", 
            type: "Service Not Delivered", 
            parties: ["client123", "freelancer456"], 
            amount: "$1,200",
            status: "active",
            opened: "2023-06-12"
        },
        { 
            id: "DIS-002", 
            type: "Payment Dispute", 
            parties: ["client789", "agency001"], 
            amount: "$3,500",
            status: "resolved",
            opened: "2023-06-05"
        },
        { 
            id: "DIS-003", 
            type: "Quality Dispute", 
            parties: ["client456", "designer007"], 
            amount: "$800",
            status: "active",
            opened: "2023-06-10"
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Dispute Moderation</h2>
        
            <div className="space-y-4">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className={`flex items-center justify-between p-4 ${
                            dispute.status === 'active' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-800'
                        }`}>
                            <div className="flex items-center">
                                <AlertTriangle className={`w-5 h-5 mr-2 ${
                                dispute.status === 'active' ? 'text-yellow-500' : 'text-gray-500'
                                }`} />
                                <span className="font-medium text-gray-800 dark:text-white">Dispute #{dispute.id}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                dispute.status === 'active' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}>
                                {dispute.status}
                            </span>
                        </div>
                        
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type</h4>
                                <p className="text-gray-800 dark:text-white">{dispute.type}</p>
                                </div>
                                <div>
                                <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parties</h4>
                                <div className="flex flex-wrap gap-1">
                                    {dispute.parties.map((party, i) => (
                                    <span key={i} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                                        {party}
                                    </span>
                                    ))}
                                </div>
                                </div>
                                <div>
                                <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</h4>
                                <p className="text-gray-800 dark:text-white">{dispute.amount}</p>
                                </div>
                            </div>
                        
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                Opened: {dispute.opened}
                                </span>
                                
                                {dispute.status === 'active' ? (
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg flex items-center hover:bg-green-200 dark:hover:bg-green-800">
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg flex items-center hover:bg-red-200 dark:hover:bg-red-800">
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                    <button className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-lg flex items-center hover:bg-blue-200 dark:hover:bg-blue-800">
                                    <Gavel className="w-4 h-4 mr-1" /> Moderate
                                    </button>
                                </div>
                                ) : (
                                <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <Gavel className="w-4 h-4 mr-1" /> View Resolution
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};