import { User, FileText, Check, X, Clock } from 'lucide-react';


export const VerificationRequests = () => {
    const requests = [
        { 
            id: "VR-001", 
            user: "designer_john", 
            type: "Portfolio", 
            date: "2023-06-10", 
            status: "pending",
            documents: 3
        },
        { 
            id: "VR-002", 
            user: "dev_sarah", 
            type: "Developer Certification", 
            date: "2023-06-08", 
            status: "pending",
            documents: 2
        },
        { 
            id: "VR-003", 
            user: "marketer_ali", 
            type: "Business License", 
            date: "2023-06-05", 
            status: "approved",
            documents: 1
        },
    ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Verification Requests</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verification Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documents</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{request.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" /> {request.user}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{request.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> {request.documents}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${
                    request.status === 'approved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    request.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {request.status === 'approved' ? <Check className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1">
                      <X className="w-5 h-5" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1">
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};