"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useUserStore } from '../../../../stores/userStore';

type BusinessFormData = {
    name: string;
    username: string;
    bio: string;
    avatar_url: string;
    address: string;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function BusinessProfilePage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const setUser = useUserStore(state => state.setUser);
    const [formData, setFormData] = useState<BusinessFormData>({
        name: '',
        username: '',
        bio: '',
        avatar_url: '',
        address: '',
    });
    const [token, setToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const currentAccount = useCurrentAccount();
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [storageData, setStorageData] = useState<any>(null);

    // Log current wallet connection status
    useEffect(() => {
        console.log('Current wallet connection status:', {
            isConnected: !!currentAccount,
            address: currentAccount?.address,
            chains: currentAccount?.chains
        });
    }, [currentAccount]);

    // Initialize data on component mount
    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        setToken(authToken);

        try {
            const storedData = sessionStorage.getItem('@enoki/flow/state/enoki_public_9a3de95df9a16f168ba9ebf1cc36cc1d/devnet');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setStorageData(parsedData);
                console.log('Session storage data:', parsedData);
                
                setFormData(prev => ({
                    ...prev,
                    address: parsedData?.address || currentAccount?.address || ''
                }));
            }
        } catch (error) {
            console.error('Error parsing session storage data:', error);
            toast.error('Failed to load wallet data');
        }
    }, [currentAccount]);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const validateFile = (file: File): boolean => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Only JPEG, PNG, and WebP images are allowed');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size should be less than 2MB');
        return false;
      }
      return true;
    };
  
    const uploadToCloudinary = async (file: File): Promise<string> => {
      if (!process.env.NEXT_PUBLIC_CLOUDE_NAME) {
        throw new Error('Cloudinary configuration missing');
      }
  
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'productimage');
      uploadData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDE_NAME);
  
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDE_NAME}/image/upload`,
          {
            method: 'POST',
            body: uploadData,
          }
        );
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Upload failed');
        }
  
        const data = await res.json();
        return data.secure_url;
      } catch (err) {
        console.error('Upload error:', err);
        throw new Error('Failed to upload image');
      }
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
  
    const validateForm = (): boolean => {
      if (!formData.name.trim()) {
        toast.error('Business name is required');
        return false;
      }
      if (!formData.username.trim()) {
        toast.error('Username is required');
        return false;
      }
      if (!formData.address.trim()) {
        toast.error('Wallet address is required');
        return false;
      }
      if (!token) {
        toast.error('Authentication token missing');
        return false;
      }
      return true;
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!validateForm()) return;
  
      try {
        setLoading(true);
  
        // Use current account address if available
        const walletAddress = currentAccount?.address || storageData?.address || formData.address;
        if (!walletAddress) {
          throw new Error('No wallet address available');
        }
  
        // Upload avatar if selected
        let avatarUrl = formData.avatar_url;
        if (avatarFile) {
          try {
            avatarUrl = await uploadToCloudinary(avatarFile);
            setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
          } catch (error) {
            toast.error('Failed to upload avatar');
            console.error(error);
            return;
          }
        }
  
        const payload = {
          authToken: token,
          walletAddress: walletAddress,
          userType: "user",
          bio: formData.bio,
          username: formData.username,
          name: formData.name,
          avatarUrl: avatarUrl
        };
  
        console.log('Submitting form with payload:', payload);
  
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
          throw new Error('Backend URL not configured');
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Submission failed');
        }
  
        const result = await response.json();
        console.log('API response:', result);
  
        setUser({
            id: result.id,
            name: result.name || formData.name,
        });
        
        toast.success('Profile created successfully!');
        router.push('/business');
      } catch (err) {
        console.error('Submission error:', err);
        toast.error(err instanceof Error ? err.message : 'Error creating profile');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Business Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Complete your business profile to get started
            </p>
            {currentAccount && (
              <p className="mt-2 text-xs text-green-600">
                Wallet connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
          
                      {/* Business Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Business Name *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Your business name"
                            disabled={loading}
                          />
                        </div>
                      </div>
          
                      {/* Username */}
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="yourusername"
                            disabled={loading}
                          />
                        </div>
                      </div>
          
                      {/* Bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <textarea
                            name="bio"
                            id="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Tell us about your business"
                            disabled={loading}
                          />
                        </div>
                      </div>
          
                      {/* Address */}
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Wallet Address *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-gray-100"
                            placeholder="Wallet address"
                            disabled
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Connected wallet address</p>
                      </div>
          
                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={loading || uploading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Create Profile'
                          )}
                        </button>
                      </div>
                    </form>
        </div>
      </div>
    </div>
  );
}