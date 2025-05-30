import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';


export const DAOProposalsPanel = () => {
    const proposals = [
        { 
            id: "DP-001", 
            title: "Increase platform fee to 2.5%", 
            status: "active", 
            votesFor: 1245, 
            votesAgainst: 892,
            endDate: "2023-06-15"
        },
        { 
            id: "DP-002", 
            title: "Add new verification provider", 
            status: "passed", 
            votesFor: 2103, 
            votesAgainst: 756,
            endDate: "2023-06-05"
        },
        { 
            id: "DP-003", 
            title: "Treasury fund allocation", 
            status: "rejected", 
            votesFor: 892, 
            votesAgainst: 2341,
            endDate: "2023-05-28"
        },
        { 
            id: "DP-004", 
            title: "Update moderation guidelines", 
            status: "pending", 
            votesFor: 0, 
            votesAgainst: 0,
            endDate: "2023-06-20"
        },
    ];

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'active': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'passed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">DAO Proposals</h2>
        
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proposal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Votes For</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Votes Against</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {proposals.map((proposal) => (
                        <tr key={proposal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{proposal.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{proposal.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                                {getStatusIcon(proposal.status)}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 capitalize">{proposal.status}</span>
                            </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">{proposal.votesFor.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{proposal.votesAgainst.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{proposal.endDate}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};