'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    title: string;
    description: string;
    duration: string;
    price: string;
    serviceId: string;
    image: File | null;
    imagePreview: string;
}

interface Errors {
    title?: string;
    description?: string;
    duration?: string;
    price?: string;
    serviceId?: string;
    image?: string;
}

interface ServiceSession {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    price: number;
    serviceId: string;
    imageUrl: string;
    createdAt: string;
}

const dummyServiceSessions: ServiceSession[] = [
    {
        id: '1',
        title: 'Premium Haircut Session',
        description: '60-minute premium haircut with styling and consultation',
        duration: 60,
        price: 65,
        serviceId: '1',
        imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=128&h=128&q=80',
        createdAt: '2025-06-15T10:30:00Z'
    },
    {
        id: '2',
        title: 'Deluxe Color Treatment',
        description: '120-minute full color service with conditioning treatment',
        duration: 120,
        price: 120,
        serviceId: '3',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=128&h=128&q=80',
        createdAt: '2025-06-10T09:45:00Z'
    }
];

const dummyServices = [
    { id: '1', name: 'Haircut' },
    { id: '2', name: 'Beard Trim' },
    { id: '3', name: 'Hair Color' },
    { id: '4', name: 'Kids Haircut' },
    { id: '5', name: 'Scalp Massage' }
];

export default function ServiceSessionUpload() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const services = dummyServices;

    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        duration: '',
        price: '',
        serviceId: '',
        image: null,
        imagePreview: ''
    });

    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (params.id) {
        const fetchServiceSession = async () => {
            try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const session = dummyServiceSessions.find(s => s.id === params.id);
            
            if (session) {
                setFormData({
                title: session.title,
                description: session.description,
                duration: session.duration.toString(),
                price: session.price.toString(),
                serviceId: session.serviceId,
                image: null,
                imagePreview: session.imageUrl || ''
                });
                
                setIsEditing(true);
            } else {
                toast.error('Service session not found');
                router.push('/dashboard/service-sessions');
            }
            } catch (error) {
            toast.error('Failed to fetch service session details');
            console.error('Error fetching service session:', error);
            } finally {
            setIsLoading(false);
            }
        };
        
        fetchServiceSession();
        }
    }, [params.id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        
        if (errors[name as keyof Errors]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        

        if (!file.type.match('image.*')) {
            setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: URL.createObjectURL(file)
        }));
        
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: '' }));
        }
        }
    };

    const validateForm = () => {
        const newErrors: Errors = {};
        
        if (!formData.title.trim()) {
        newErrors.title = 'Session title is required';
        }
        
        if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
        newErrors.description = 'Description should be at least 10 characters';
        }
        
        if (!formData.duration) {
        newErrors.duration = 'Duration is required';
        } else if (isNaN(Number(formData.duration))) {
        newErrors.duration = 'Duration must be a number (minutes)';
        }
        
        if (!formData.price) {
        newErrors.price = 'Price is required';
        } else if (isNaN(Number(formData.price))) {
        newErrors.price = 'Price must be a number';
        }
        
        if (!formData.serviceId) {
        newErrors.serviceId = 'Service selection is required';
        }
        
        if (!isEditing && !formData.image) {
        newErrors.image = 'Image is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
        return;
        }
        
        try {
        setIsLoading(true);
        
        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('duration', formData.duration);
        formPayload.append('price', formData.price);
        formPayload.append('serviceId', formData.serviceId);
        if (formData.image) {
            formPayload.append('image', formData.image);
        }
        
        // const endpoint = isEditing 
        //     ? `/api/service-sessions/${params.id}` 
        //     : '/api/service-sessions';
        // const method = isEditing ? 'PUT' : 'POST';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
            toast.success(`Service session ${isEditing ? 'updated' : 'created'} successfully!`);
            router.push('/dashboard/service-sessions');
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} service session`);
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <aside className='dark:bg-gray-800'>
            <div className="max-w-4xl p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/50">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {isEditing ? 'Edit Service Session' : 'Create New Service Session'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Session Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
                            errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-gray-200`}
                        disabled={isLoading}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
                            errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-gray-200`}
                        disabled={isLoading}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (minutes) *
                        </label>
                        <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
                                errors.duration ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                            } dark:bg-gray-700 dark:text-gray-200`}
                            disabled={isLoading}
                        />
                        {errors.duration && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                $
                            </span>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={`w-full pl-8 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
                                    errors.price ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                } dark:bg-gray-700 dark:text-gray-200`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
                    </div>
                </div>
                
                <div>
                    <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Associated Service *
                    </label>
                    <select
                        id="serviceId"
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
                            errors.serviceId ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-gray-200`}
                        disabled={isLoading}
                    >
                        <option value="">Select a service</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                    {errors.serviceId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceId}</p>}
                </div>
                
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Session Image {!isEditing && '*'}
                    </label>
                    
                    {formData.imagePreview ? (
                        <div className="mb-4">
                            <Image
                                src={formData.imagePreview}
                                alt="Session preview"
                                width={160}
                                height={160}
                                className="h-40 w-40 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                            />
                        </div>
                    ) : null}
                    
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${
                            errors.image ? 'file:bg-red-50 dark:file:bg-red-900/20 file:text-red-700 dark:file:text-red-400' 
                            : 'file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400'
                        } file:hover:cursor-pointer dark:file:hover:bg-gray-700`}
                        disabled={isLoading}
                    />
                    {errors.image && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Upload a high-quality image (max 5MB)</p>
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/service-sessions')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : isEditing ? (
                            'Update Session'
                        ) : (
                            'Create Session'
                        )}
                    </button>
                </div>
            </form>
            </div>
        </aside>
    );
}