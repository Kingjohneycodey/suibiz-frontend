"use client";
import { useState } from 'react';
import ProfileCard from "@/components/dashboard/profile/profile-display";
import { FiSearch, FiFilter, FiChevronDown, FiPlus } from "react-icons/fi";
import Image from 'next/image';
import { Footer } from '@/components/landing-page/Footer';
import { Header } from '@/components/landing-page/Header';

export default function ProfileDisplay() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);

    const profileCardData = [
        {
            id: 1,
            name: 'John Doe',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 5,
            totalVolume: 1000,
            createdAt: '2023-10-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 3,
            totalVolume: 500,
            createdAt: '2023-11-20'
        },
        {
            id: 3,
            name: 'Alice Johnson',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 8,
            totalVolume: 2000,
            createdAt: '2023-09-05'
        },
        {
            id: 4,
            name: 'Michael Brown',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 12,
            totalVolume: 3500,
            createdAt: '2023-12-10'
        },
        {
            id: 5,
            name: 'Sarah Wilson',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 6,
            totalVolume: 1800,
            createdAt: '2023-08-22'
        },
        {
            id: 6,
            name: 'David Lee',
            image: '/about-image.webp',
            profileImage: '/services/profile/1.jpg',
            itemsCount: 9,
            totalVolume: 2700,
            createdAt: '2023-11-30'
        },
    ];

    const filteredProfiles = profileCardData
        .filter(profile => 
            profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.itemsCount.toString().includes(searchQuery) ||
            profile.totalVolume.toString().includes(searchQuery)
        )
        .sort((a, b) => {
            switch(sortOption) {
                case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'highest': return b.totalVolume - a.totalVolume;
                case 'lowest': return a.totalVolume - b.totalVolume;
                default: return 0;
            }
    });

    const profilesPerPage = 8;
    const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
    const paginatedProfiles = filteredProfiles.slice(
        (currentPage - 1) * profilesPerPage,
        currentPage * profilesPerPage
    );

    return (
        <>
        <Header />
        <main className="min-h-screen bg-gray-50">
            <div className="relative bg-gray-900">
                <Image
                    width={1920}
                    height={300}
                    src="/about-image.webp" 
                    alt="Profiles Header"
                    className="w-full h-48 object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-4xl font-bold text-white mb-2">Community Profiles</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Discover and connect with our vibrant community members
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto flex-1">
                        <div className="relative max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                placeholder="Search profiles..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none block pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest</option>
                                <option value="highest">Highest Volume</option>
                                <option value="lowest">Lowest Volume</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FiChevronDown className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
                {paginatedProfiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {paginatedProfiles.map((profile) => (
                            <div key={profile.id} className="transform transition-all hover:-translate-y-1 hover:shadow-md">
                                <ProfileCard
                                    name={profile.name}
                                    image={profile.image}
                                    profileImage={profile.profileImage}
                                    itemsCount={profile.itemsCount}
                                    totalVolume={profile.totalVolume}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-700">No profiles found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3.5 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                        
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} border border-gray-200`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3.5 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </main>
        <Footer />
        </>
        
    );
}