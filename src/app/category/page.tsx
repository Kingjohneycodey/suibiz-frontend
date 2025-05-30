"use client";
import { useState } from 'react';

type Category = {
    id: number;
    name: string;
};

export default function CategoryPage() {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    
    // Sample categories - replace with your actual data
    const categories: Category[] = [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Travel' },
        { id: 3, name: 'Food' },
        { id: 4, name: 'Fitness' },
        { id: 5, name: 'Art' },
        { id: 6, name: 'Music' },
        { id: 7, name: 'Business' },
        { id: 8, name: 'Education' },
    ];

    const toggleCategory = (categoryId: number): void => {
        setSelectedCategories(prev => 
        prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId]
        );
    };

    const handleContinue = (): void => {
        console.log('Selected categories:', selectedCategories);
    };

    return (
        <div className="min-h-screen relative p-6" style={{ background: 'linear-gradient(to bottom, #622390, #1D0A2A)' }}>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-8">
                    <button className="text-xl text-center bg-purple-600 p-4 rounded-lg text-white/90">
                        Select A Category
                    </button>
                </div>

                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                    {categories.map((category: Category) => (
                        <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`aspect-square flex items-center justify-center p-4 rounded-lg transition-all
                                ${selectedCategories.includes(category.id) 
                                ? 'border-2 border-white text-white' 
                                : 'bg-transparent text-white border border-white/20 hover:border-white/30'}`}
                        >
                            <span className="font-medium text-center">{category.name}</span>
                        </button>
                    ))}
                </div>
                
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                        onClick={handleContinue}
                        disabled={selectedCategories.length === 0}
                        className={`px-8 py-3 rounded-lg font-bold text-white transition-all
                        ${selectedCategories.length === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-purple-800 hover:bg-purple-700'}`}
                    >
                        Continue
                    </button>
                </div>

            </div>
        </div>
    );
}