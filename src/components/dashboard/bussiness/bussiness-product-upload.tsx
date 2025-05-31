'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUpload, FiX, FiImage, FiDollarSign, FiTag, FiAlignLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';


const dummyProducts = [
    {
        id: 1,
        name: 'Premium Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots and cash compartment. Handcrafted with premium materials.',
        price: '49.99',
        category: 'clothing',
        imageUrl: '/sample-wallet.jpg'
    },
    {
        id: 2,
        name: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones with 30-hour battery life and premium sound quality.',
        price: '199.99',
        category: 'electronics',
        imageUrl: '/sample-headphones.jpg'
    }
];

export default function ProductUploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const isEditMode = Boolean(productId);
    
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
    });

    // Load product data when in edit mode
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
        
            const product = dummyProducts.find(p => p.id === Number(productId));
        
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                });
                
                setImagePreview(product.imageUrl);
            } else {
                toast.error('Product not found');
                router.push('/business/product-upload');
            }
        
            setIsLoading(false);
        }
    }, [isEditMode, productId, router]);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) return;
        
        // Validate image
        if (!file.type.match('image.*')) {
            setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
            return;
        }
        
        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Clear error
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
            isValid = false;
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
            isValid = false;
        } else if (isNaN(Number(formData.price))) {
            newErrors.price = 'Price must be a number';
            isValid = false;
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        if (!imagePreview && !imageFile) {
            newErrors.image = 'Product image is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
        setIsLoading(true);
        
        // In a real app, you would upload to your backend here
        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('description', formData.description);
        formPayload.append('price', formData.price);
        formPayload.append('category', formData.category);
        if (imageFile) {
            formPayload.append('image', imageFile);
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success(isEditMode ? 'Product updated successfully!' : 'Product uploaded successfully!');
        router.push('/admin/products');
        } catch (error) {
        toast.error(isEditMode ? 'Failed to update product' : 'Failed to upload product');
        console.error('Error:', error);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Upload New Product'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
            {isEditMode 
                ? 'Update the product details below'
                : 'Fill in the details below to add a new product to your inventory'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image Upload */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image *
            </label>
            
            {imagePreview ? (
                <div className="relative group">
                <Image
                    src={imagePreview}
                    alt="Product preview"
                    width={500}
                    height={400}
                    className="h-64 w-full object-cover rounded-lg border-2 border-dashed border-gray-300"
                />
                <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    title="Remove image"
                >
                    <FiX className="h-5 w-5 text-red-500" />
                </button>
                </div>
            ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                    <div className="flex justify-center">
                    <FiImage className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                        <span>Upload an image</span>
                        <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                    </p>
                </div>
                </div>
            )}
            {errors.image && (
                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
            </div>

            {/* Product Name */}
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
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
                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Premium Leather Wallet"
                />
            </div>
            {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            </div>

            {/* Product Description */}
            <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your product in detail..."
                />
            </div>
            {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
                </label>
                <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                />
                </div>
                {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
            </div>

            {/* Product Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
                </label>
                <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`block w-full pl-3 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Kitchen</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="other">Other</option>
                </select>
                {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
            </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
            <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Uploading...'}
                </span>
                ) : (
                <span className="flex items-center">
                    <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                    {isEditMode ? 'Update Product' : 'Upload Product'}
                </span>
                )}
            </button>
            </div>
        </form>
        </div>
    );
}