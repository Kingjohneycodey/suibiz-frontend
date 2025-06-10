"use client";
import { ChangeEvent, useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { useUserStore } from '../../../../stores/userStore';
import { useCurrentAccount } from '@mysten/dapp-kit';
import toast from 'react-hot-toast';
import Image from 'next/image';

const UserProfile = () => {
  const [name, setName] = useState<string>('John Doe');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [workSamples, setWorkSamples] = useState<File[]>([]);
  const { user } = useUserStore()
  const account = useCurrentAccount()
  const [uploading, setUploading] = useState(false);
  console.log(user)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWorkSamples(Array.from(e.target.files));
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      console.log("error")
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size should be less than 2MB');
      console.log("error")
      return false;
    }
    return true;
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadstart = () => {
      setUploading(true);
    };
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setUploading(false);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };



  return (
    <div className="space-y-6 dark:bg-gray-800">
      <div className="p-6 rounded-lg shadow max-w-2xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Customer Profile</h2>

        <div className="space-y-4">

          <div className="flex flex-col items-center">
            <div className="relative">
              {avatarPreview ? (
                <Image
                  width={128}
                  height={128}
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                  priority
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading image...
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={user?.name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Userame</label>
            <input
              type="text"
              value={user?.username}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <input
              type="text"
              value={user?.role}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-gray-100 dark:bg-gray-700"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Connected Wallet</label>
            <input
              type="text"
              value={account?.address || 'Not connected'}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-gray-100 dark:bg-gray-700"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              value={user?.bio || ''}
              onChange={(e) => {/* handle bio change here if needed */ }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:text-amber-50 bg-white dark:bg-gray-700"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
        </div>

        {/* <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">Work Samples</h2>
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
          </div> */}

      </div>
    </div>
  );
};

export default UserProfile;