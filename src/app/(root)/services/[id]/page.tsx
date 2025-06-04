"use client";

import { Footer } from '@/components/landing-page/Footer';
import { Header } from '@/components/landing-page/Header';
import { Calendar, Clock, MapPin, CheckCircle, Star, ChevronRight, Bookmark, Share2, MessageCircle } from 'lucide-react';
import Image from "next/image";
import { useParams } from "next/navigation";

interface IService {
    id: number;
    service: string;
    name: string;
    description: string;
    category: string;
    rate: string;
    imageUrl?: string;
    profileImage?: string;
    tags?: string[];
    longDescription?: string;
    availability?: string;
    location?: string;
    experience?: string;
    rating?: number;
    reviewCount?: number;
    deliveryTime?: string;
}

const services: IService[] = [
    {
        id: 1,
        name: "John Doe",
        service: "Web Development",
        imageUrl: '/services/web-dev.avif',
        profileImage: '/services/profile/1.jpg',
        description: "Full-stack development using React and Node.js",
        longDescription: "I specialize in building modern, responsive web applications using cutting-edge technologies. With over 5 years of experience, I can help you create anything from simple landing pages to complex web applications. My expertise includes React, Next.js, Node.js, and TypeScript.",
        category: 'Technology',
        rate: "$50/hr",
        tags: ["web development", "react", "node.js"],
        availability: "Mon-Fri, 9am-5pm",
        location: "Remote",
        experience: "5+ years",
        rating: 4.8,
        reviewCount: 24,
        deliveryTime: "1-2 weeks"
    },
];

export default function ServiceDetailsPage() {
    const params = useParams();
    const serviceId = Number(params.id);
    console.log({params})
    const service = services.find(s => s.id === serviceId);

    if (!service) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
                    <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
                    <button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                        onClick={() => window.location.href = '/services'}
                    >
                        Browse Services
                    </button>
                </div>
            </div>
        );
    }

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(service.rating || 0);
        const hasHalfStar = (service.rating || 0) % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
            } else {
                stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
            }
        }

        return stars;
    };

    return (
        <section>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">{service.service}</h1>
                        <div className="flex space-x-4">
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="relative h-96 w-full rounded-xl overflow-hidden mb-6">
                                <Image
                                    src={service.imageUrl || '/services/placeholder.jpg'}
                                    alt={service.service}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="flex items-center mb-8">
                                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                                    <Image
                                        src={service.profileImage || '/services/profile/placeholder.jpg'}
                                        alt={service.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
                                    <div className="flex items-center mt-1">
                                        <div className="flex mr-2">
                                            {renderStars()}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {service.rating} ({service.reviewCount} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Service</h3>
                                <p className="text-gray-700 mb-4">{service.longDescription}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-indigo-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Availability</p>
                                            <p className="font-medium">{service.availability}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-indigo-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Time</p>
                                            <p className="font-medium">{service.deliveryTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 text-indigo-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium">{service.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-indigo-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{service.experience}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {service.tags && service.tags.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {service.tags.map((tag, index) => (
                                            <span 
                                                key={index}
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    index % 3 === 0 ? 'bg-blue-100 text-blue-800' : 
                                                    index % 3 === 1 ? 'bg-purple-100 text-purple-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <div className="flex mr-2">
                                            {renderStars()}
                                        </div>
                                        <span className="text-lg font-semibold ml-2">{service.rating} out of 5</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{service.reviewCount} global ratings</p>
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                                        See all reviews <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-xl shadow-md sticky top-8 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.rate}</h3>
                                    <p className="text-gray-600">Starting price</p>
                                </div>

                                <div className="p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">Custom web application development</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">Responsive design for all devices</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">SEO optimization</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">1 month of free support</span>
                                        </li>
                                    </ul>

                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 mb-4">
                                        Book Now
                                    </button>

                                    <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Contact Provider
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </section>
        
    );
}