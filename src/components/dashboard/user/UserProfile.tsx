"use client";
import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

const UserProfile = () => {
  const [name, setName] = useState<string>('John Doe');
  const [did] = useState<string>('user123.did');
  const [workSamples, setWorkSamples] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWorkSamples(Array.from(e.target.files));
    }
  };

  const connectSocialMedia = () => {
  };

  return (
    <div className="space-y-6 dark:bg-gray-800">      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">DID Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">DID</label>
            <input 
              type="text" 
              value={did}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-gray-100 dark:bg-gray-700"
              disabled
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">Work Samples</h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-10 h-10 mx-auto text-gray-400" />
            <p className="mt-2 dark:text-white">Drag and drop files here or click to upload</p>
            <input 
              type="file" 
              multiple 
              onChange={handleFileUpload}
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block cursor-pointer"
            >
              Upload Files
            </label>
            {workSamples.length > 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {workSamples.length} file(s) selected
              </p>
            )}
          </div>

          <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">Linked Accounts</h2>
          <button 
            onClick={connectSocialMedia}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <LinkIcon className="w-5 h-5" />
            <span className="dark:text-white">Connect Social Media</span>
          </button>
      </div>
    </div>
  );
};

export default UserProfile;