"use client";

import Image from "next/image";

interface ServiceCardProps {
    service: {
        id: string;
        service: string;
        name: string;
        description: string;
        rate: string;
        imageUrl?: string;
        profileImage?: string;
        tags?: string[];
    };
}

const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
];

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <div className="relative h-48 w-full">
                <Image
                    src={service.imageUrl || "/services/hero-hair.jpg"}
                    alt={service.service}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-service.jpg";
                    }}
                />
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                            src={service.profileImage || "/services/profile/client-1.jpg"}
                            alt={service.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/services/profile/client-1.jpg";
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center">
                            <svg
                                className="w-4 h-4 text-yellow-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {service.service}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                {service.tags && service.tags.length > 0 && (
                    <div className="mt-auto mb-4 flex flex-wrap gap-2">
                        {service.tags.slice(0, 3).map((tag, index) => (
                            <span 
                                key={index} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                    tagColors[index % tagColors.length]
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-lg font-bold text-gray-900">{service.rate}</span>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}