'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiUpload, FiX, FiImage, FiDollarSign, FiTag, FiAlignLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { storeDataToWalrus, storeFileToWalrus } from '@/utils/walrus';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CreateStorePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const isEditMode = Boolean(productId);
    const currentAccount = useCurrentAccount();
    const [loading, setLoading] = useState(false);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [uploading, setUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        fullname: '',
        name: '',
        description: '',
        location: "",
        address: "",
        avatar_url: ""
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        fullname: '',
        location: '',
        image: '',
    });


    useEffect(() => {
        console.log('Current wallet connection status:', {
          currentAccount
        });
    
        if(!currentAccount){
          router.refresh()
        }
      }, [currentAccount]);
    
      useEffect(() => {
        try {
          const storedData = sessionStorage.getItem('@enoki/flow/state/enoki_public_e5a1d53741cdbe61403b4c6de297ca10/testnet');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
    
            setFormData(prev => ({
              ...prev,
              address: parsedData?.address || currentAccount?.address
            }));
          } else if (currentAccount?.address){
            setFormData(prev => ({
              ...prev,
              address: currentAccount?.address || ""
            }));
          }
        } catch (error) {
          console.error('Error parsing session storage data:', error);
          toast.error('Failed to load wallet data');
        }
      }, [currentAccount]);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const removeImage = () => {
        setAvatarPreview("");
        setAvatarFile(null);
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
          toast.error('Store username is required');
          return false;
        }
        if (!formData.fullname.trim()) {
          toast.error('Store name is required');
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
    
        if (!validateForm()) return;
    
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
            description: formData.description,
            fullname: formData.fullname,
            location: formData.location,
            name: formData.name,
            photo: avatarUrl
          };
    
          const data = await storeDataToWalrus(payload, formData.address);
    
          await handleListItem({ metadata_uri: data, name: payload.name })
    
        } catch (err) {
          console.warn('Submission error:', err);
          toast.error(err instanceof Error ? err.message : 'Error creating profile');
        } finally {
          setLoading(false);
        }
      };
    
      interface HandleListItemParams {
        metadata_uri: string;
        name: string;
      }
    
      const handleListItem = async ({ metadata_uri, name }: HandleListItemParams): Promise<void> => {
        setLoading(true);
    
    
        try {
          const tx = new TransactionBlock();
          tx.moveCall({
            target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::create_store`,
            arguments: [
              tx.object(`${process.env.NEXT_PUBLIC_STORE_REGISTRY_ID}`),
              tx.pure(name),
              tx.pure(metadata_uri),
              
            ],
          });
    
          signAndExecuteTransaction(
            {
              transaction: tx.serialize(),
              chain: 'sui:testnet',
            },
            {
              onSuccess: () => {
                toast.success('Store created successfully!');

                console.log("the")

                setLoading(false);
    
                // router.refresh()
              },
              onError: (err: { message: string }) => {
                if (err.message == "No valid gas coins found for the transaction.") {
                  toast.error(err.message + "Fund your sui wallet account and try agains")
                } else {
                  toast.error(err.message)
                }

                setLoading(false);
    
    
                console.error('Transaction Error:', err.message);
              },
            }
          );
        } catch (err) {
          console.error('Error preparing transaction:', err);
        }
      };


    return (
        <div className="dark:bg-gray-900 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl lg:mx-0">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditMode ? 'Edit Product' : 'Create Store'}
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {isEditMode 
                        ? 'Update the product details below'
                        : 'Fill in your store details below'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Store Photo *
                    </label>
                
                    {avatarPreview ? (
                        <div className="relative group">
                            <Image
                                src={avatarPreview}
                                alt="Product preview"
                                width={500}
                                height={400}
                                className="h-64 w-full object-cover rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                title="Remove image"
                            >
                                <FiX className="h-5 w-5 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <div className="flex justify-center">
                                    <FiImage className="h-12 w-12 text-gray-400" />
                                </div>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                                    >
                                        <span>Upload an image</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    )}
                    {errors.image && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Store Name *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiTag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                                errors.fullname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="e.g. John's store"
                        />
                    </div>
                    {errors.fullname && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullname}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Store Username *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiTag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="e.g. johney1"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
                            <FiAlignLeft className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Describe your store in detail..."
                        />
                    </div>
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Store location *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiTag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                                errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="e.g. Port Harcourt"
                        />
                    </div>
                    {errors.location && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                    )}
                </div>

    

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/business/products')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                'Creating...'
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                                'Create Store'
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}