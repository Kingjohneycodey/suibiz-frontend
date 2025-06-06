"use client";
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';


interface Product {
    id: number | null;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
}

export default function ProductDisplay() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            description: 'Noise-cancelling over-ear headphones with 30-hour battery life',
            price: 299.99,
            category: 'Audio',
            stock: 45,
            image: '/headphones.webp'
        },
        {
            id: 2,
            name: 'Ultra HD Smart TV 55"',
            description: '4K HDR LED smart TV with built-in streaming apps',
            price: 799.99,
            category: 'Electronics',
            stock: 12,
            image: '/urtal_tv.avif'
        },
        {
            id: 3,
            name: 'Ergonomic Office Chair',
            description: 'Adjustable lumbar support with breathable mesh back',
            price: 249.99,
            category: 'Furniture',
            stock: 23,
            image: '/chair.webp'
        }
    ]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 5;

    const filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleDelete = (id: number): void => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    const handleSave = (): void => {
        if (!editingProduct) return;

        if (editingProduct.id) {
            setProducts(products.map(product => 
                product.id === editingProduct.id ? editingProduct : product
            ));
        } else {
            const newId = Math.max(...products.map(p => p.id || 0), 0) + 1;
            setProducts([...products, { ...editingProduct, id: newId }]);
        }
        setEditingProduct(null);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-black/85 dark:text-gray-200">Product Management</h2>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="pl-10 pr-4 py-2 rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link href="/business/products" className="flex items-center">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors text-white"
                                >
                                    <FiPlus />
                                    <span>Add Product</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {editingProduct && (
                        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-2xl">
                                <div className="px-6 py-4 border-b dark:border-gray-600">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                        {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            value={editingProduct.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                            setEditingProduct({...editingProduct, name: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            value={editingProduct.price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                            setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})
                                            }
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            rows={3}
                                            value={editingProduct.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                                                setEditingProduct({...editingProduct, description: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            value={editingProduct.category}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                setEditingProduct({...editingProduct, category: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            value={editingProduct.stock}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})
                                            }
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                                            value={editingProduct.image}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                setEditingProduct({...editingProduct, image: e.target.value})
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t dark:border-gray-600 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setEditingProduct(null)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product: Product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <Image width={100} height={100} className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-200">{product.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-200">${product.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/business/product-upload?id=${product.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                                    >
                                                        <FiEdit className="inline" />
                                                    </button>
                                                </Link>

                                                <button
                                                    onClick={() => product.id && handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <FiTrash2 className="inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredProducts.length > productsPerPage && (
                        <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredProducts.length}</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <FiChevronLeft />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}