"use client";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { fetchCreatorsProducts, fetchProducts } from "@/services/products";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Product {
  id: number | null;
  name: string;
  description: string;
  price: number;
  category: string;
  available_items: [];
  photo: string;
}

// const data  = [
//     {
//         id: 1,
//         name: "Premium Wireless Headphones",
//         description:
//           "Noise-cancelling over-ear headphones with 30-hour battery life",
//         price: 299.99,
//         category: "Audio",
//         stock: 45,
//         image: "/headphones.webp",
//       },
//       {
//         id: 2,
//         name: 'Ultra HD Smart TV 55"',
//         description: "4K HDR LED smart TV with built-in streaming apps",
//         price: 799.99,
//         category: "Electronics",
//         stock: 12,
//         image: "/urtal_tv.avif",
//       },
//       {
//         id: 3,
//         name: "Ergonomic Office Chair",
//         description: "Adjustable lumbar support with breathable mesh back",
//         price: 249.99,
//         category: "Furniture",
//         stock: 23,
//         image: "/chair.webp",
//       },
// ] 

export default function ProductDisplay() {
  const [products, setProducts] = useState<Product[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 5;

  const currentAccount = useCurrentAccount();

  useEffect(() => {
    const fetchAllroducts = async () => {

        
      const stores = await fetchCreatorsProducts(currentAccount?.address || "");


      console.log(stores)

      setProducts(stores.products)
      console.log(stores);
    };
    fetchAllroducts();
  }, [currentAccount]);

  const filteredProducts = products.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleDelete = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleSave = (): void => {
    if (!editingProduct) return;

    if (editingProduct.id) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? editingProduct : product
        )
      );
    } else {
      const newId = Math.max(...products.map((p) => p.id || 0), 0) + 1;
      setProducts([...products, { ...editingProduct, id: newId }]);
    }
    setEditingProduct(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-black/85 dark:text-gray-200">
              Product Management
            </h2>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Link href="/business/product-upload" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors text-white text-sm sm:text-base">
                  <FiPlus size={18} />
                  <span>Add Product</span>
                </button>
              </Link>
            </div>
          </div>

          {editingProduct && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-4 sm:px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    {editingProduct.id ? "Edit Product" : "Add New Product"}
                  </h3>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Form fields */}
                  {['name', 'price', 'description', 'category', 'photo'].map((field) => (
                    <div key={field} className={field === 'description' ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                      </label>
                      {field === 'description' ? (
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 text-sm sm:text-base"
                          rows={3}
                          value={editingProduct[field as keyof Product] as string}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            [field]: e.target.value
                          })}
                        />
                      ) : (
                        <input
                          type={field === 'price' ? 'number' : 'text'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 text-sm sm:text-base"
                          value={editingProduct[field as keyof Product] as string | number}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            [field]: field === 'price' ? parseFloat(e.target.value) || 0 : e.target.value
                          })}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-4 sm:px-6 py-4 border-t dark:border-gray-600 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
                  {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <Image
                              width={40}
                              height={40}
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover"
                              src={product.photo}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200 line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200 line-clamp-1">
                          {product.category}
                        </div>
                      </td>
                      
                      {/* Price */}
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {(Number(product.price) / 1000000000).toFixed(2)} SUI
                        </div>
                      </td>
                      
                      {/* Stock */}
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${product.available_items.length > 10
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                        >
                          {product.available_items.length} in stock
                        </span>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/business/product-upload?id=${product.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 sm:mr-4"
                        >
                          <FiEdit className="inline" size={16} />
                        </Link>
                        <button
                          onClick={() => product.id && handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="inline" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredProducts.length > productsPerPage && (
            <div className="px-3 sm:px-6 py-4 border-t dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, filteredProducts.length)}
                </span>{' '}
                of <span className="font-medium">{filteredProducts.length}</span> results
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-1 sm:p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-1 text-gray-500">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-1 sm:p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
