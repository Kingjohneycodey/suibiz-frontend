"use client";

import { useState, useEffect } from 'react';
import { Footer } from "@/components/landing-page/Footer";
import { Header } from "@/components/landing-page/Header";
import { ServiceCard } from "@/components/services/Service-display";

interface IServices {
    id: number;
    service: string;
    name: string;
    description: string;
    category: string;
    rate: string;
    imageUrl?: string;
    profileImage?: string;
    tags?: string[];
}

const services: IServices[] = [
    {
        id: 1,
        name: "John Doe",
        service: "Web Development",
        imageUrl: '/services/web-dev.avif',
        profileImage: '/services/profile/1.jpg',
        description: "Full-stack development using React and Node.js",
        category: 'Technology',
        rate: "$50/hr",
        tags: ["web development", "react", "node.js"]
    },
    {
        id: 2,
        name: "Jane Smith",
        service: "Graphic Design",
        description: "Logos, branding, and digital illustrations",
        category: 'Design',
        rate: "$40/hr",
        imageUrl: '/services/graphics.jpeg',
        profileImage: '/services/profile/client-1.jpg',
        tags: ["graphic design", "branding", "illustration"]
    },
    {
        id: 3,
        name: "Mike Johnson",
        service: "SEO Optimization",
        description: "Improve your website's ranking and visibility",
        category: 'Marketing',
        rate: "$45/hr",
        imageUrl: '/services/SEO.webp',
        profileImage: '/services/profile/client-2.jpg',
        tags: ["seo", "search engine optimization", "digital marketing"]
    },
    {
        id: 4,
        name: "Emily Davis",
        service: "Content Writing",
        description: "Blog posts, articles, and copywriting",
        category: 'Writing',
        rate: "$30/hr",
        imageUrl: '/services/content-writer.webp',
        profileImage: '/services/profile/creator.jpeg',
        tags: ["content writing", "blogging", "copywriting"]
    },
    {
        id: 5,
        name: "Chris Brown",
        service: "Social Media Management",
        description: "Content scheduling, strategy, and analytics",
        category: 'Marketing',
        rate: "$35/hr",
        imageUrl: '/services/social-media-mangement.webp',
        profileImage: '/services/profile/founder.jpg',
        tags: ["social media", "content management", "analytics"]
    },
    {
        id: 6,
        name: "Olivia Wilson",
        service: "Photography",
        description: "Event, portrait, and product photography",
        category: 'Photography',
        rate: "$60/hr",
        imageUrl: '/services/photography.png',
        profileImage: '/services/profile/image-2.jpg',
        tags: ["photography", "event photography", "portrait photography"]
    },
    {
        id: 7,
        name: "Liam Martinez",
        service: "Video Editing",
        description: "YouTube videos, short films, and reels",
        category: 'Editing',
        imageUrl: '/services/video_editing_03.jpg',
        profileImage: '/services/profile/image-9.jpg',
        rate: "$55/hr",
        tags: ["video editing", "youtube", "short films"]
    },
    {
        id: 8,
        name: "Sophia Anderson",
        service: "Virtual Assistant",
        description: "Administrative tasks, emails, scheduling",
        category: 'Administration',
        imageUrl: '/services/virtual-assitance.jpg',
        profileImage: '/services/profile/image-4.png',
        rate: "$25/hr",
        tags: ["virtual assistant", "administrative tasks", "scheduling"]
    },
    {
        id: 9,
        name: "Noah Thomas",
        service: "Fitness Training",
        description: "Personalized fitness plans and coaching",
        category: 'Fitness',
        imageUrl: '/services/fitness.jpg',
        profileImage: '/services/profile/image-8.jpg',
        rate: "$50/hr",
        tags: ["fitness training", "personal training", "coaching"]
    },
    {
        id: 10,
        name: "Ava Moore",
        service: "Tutoring",
        description: "Math, science, and English tutoring",
        category: 'Education',
        imageUrl: '/services/tutorial.jpg',
        profileImage: '/services/profile/image-4.png',
        rate: "$30/hr",
        tags: ["tutoring", "math", "science", "english"]
    }
];

const categories = [...new Set(services.map(service => service.category))];

export default function ServicesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const cardsPerPage = 4;

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredServices.length / cardsPerPage);
    const currentServices = filteredServices.slice(
        (currentPage - 1) * cardsPerPage,
        currentPage * cardsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedCategory, searchTerm]);

    if (!services || services.length === 0) {
        return (
            <section className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">No Services Available</h1>
                    <p className="mt-2 text-gray-600">Please check back later.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Explore Professional Services
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Find the perfect service for your needs from our talented professionals
                    </p>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="w-full sm:w-1/2">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                            No services found
                        </h3>
                        <p className="mt-1 text-gray-500">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {currentServices.map((service) => (
                                <ServiceCard key={service.id} service={{ ...service, id: service.id.toString() }} />
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </section>
    );
}