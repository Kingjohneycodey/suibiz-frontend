"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../../../../../stores/userStore';
import { storeDataToWalrus, storeFileToWalrus } from '@/utils/walrus';
import { TransactionBlock } from '@mysten/sui.js/transactions';

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
  const [loading, setLoading] = useState(false);
  const currentAccount = useCurrentAccount();
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    console.log('Current wallet connection status:', {
      currentAccount
    });
  }, [currentAccount]);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('@enoki/flow/state/enoki_public_e5a1d53741cdbe61403b4c6de297ca10/testnet');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
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
  }, []);

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
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("ew")

    if (!validateForm()) return;

    console.log("ew1")

    try {
      setLoading(true);

      const walletAddress = formData.address;
      if (!walletAddress) {
        throw new Error('No wallet address available');
      }

      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        try {
          avatarUrl = await storeFileToWalrus(avatarFile, formData.address);
          console.log(avatarUrl)
          setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
        } catch (error) {
          toast.error('Failed to upload avatar');
          console.error(error);
          return;
        }
      }

      const payload = {
        address: formData.address,
        role: "business",
        bio: formData.bio,
        username: formData.username,
        name: formData.name,
        photo: avatarUrl
      };

      console.log('Submitting form with payload:', payload);

      const data = await storeDataToWalrus(payload, formData.address);


      console.log("success", data)

      await handleListItem({ metadata_uri: data, role: payload.role })

    } catch (err) {
      console.warn('Submission error:', err);
      toast.error(err instanceof Error ? err.message : 'Error creating profile');
    } finally {
      setLoading(false);
    }
  };

  interface HandleListItemParams {
    metadata_uri: string;
    role: string;
  }

  const handleListItem = async ({ metadata_uri, role }: HandleListItemParams): Promise<void> => {


    try {
      console.log("hyello ")
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::user::create_profile`,
        arguments: [
          tx.object(`${process.env.NEXT_PUBLIC_REGISTRY_ID}`),
          tx.pure(metadata_uri),
          tx.pure(role)
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result: { digest: string }) => {
            toast.success('Profile created successfully!');

            router.push('/business');
            console.log('Transaction Digest:', result.digest);
          },
          onError: (err: { message: string }) => {
            if (err.message == "No valid gas coins found for the transaction.") {
              toast.error(err.message + "Fund your sui wallet account and try agains")
            } else {
              toast.error(err.message)
            }


            console.error('Transaction Error:', err.message);
          },
        }
      );
      console.log("executedf");
    } catch (err) {
      console.error('Error preparing transaction:', err);
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
            {/* {currentAccount && (
              <p className="mt-2 text-xs text-green-600">
                Wallet connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </p>
            )} */}
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


            <div>


            </div>
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