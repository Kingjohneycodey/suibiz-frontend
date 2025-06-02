"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Footer } from "./Footer";
import { Header } from "./Header";
import Link from "next/link";

export const MarketPlace = () => {
    interface Listing {
        id: string;
        title: string;
        image: string;
        category: string;
        rating: number;
        reviews: number;
        seller: string;
        price: string;
    }

    const [listings, setListings] = useState<Listing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("featured");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('https://suibiz-backend.onrender.com/api/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch listings');
                    return;
                }

                const data = await response.json();
                const products = data.products;

                const formattedListings = products.map((item: any) => ({
                    id: item.id || 'unknown-id',
                    title: item.name || 'Untitled',
                    image: item.image_url || '/placeholder-image.jpg',
                    category: item.collection || 'Uncategorized',
                    rating: 4.5,
                    reviews: 12,
                    seller: `Seller ${item.owner?.slice(0, 6) || 'Unknown'}`,
                    price: `${item.price || '0.00'}`,
                }));

                setListings(formattedListings);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, []);

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(listings.map(item => item.category)))];

    // Filter and sort listings
    const filteredListings = listings
        .filter(listing => 
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "All" || listing.category === selectedCategory)
        )
        .sort((a, b) => {
            if (sortOption === "price-low") return parseFloat(a.price) - parseFloat(b.price);
            if (sortOption === "price-high") return parseFloat(b.price) - parseFloat(a.price);
            if (sortOption === "rating") return b.rating - a.rating;
            return 0; // Default/filtered stays as-is
        });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <Header />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Amazing Products</h1>
                    <p className="text-xl md:text-2xl mb-8">Shop the best products secured by the Sui Blockchain</p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 py-12 px-4">
                <div className="container mx-auto">
                    {/* Filters and Sorting */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filteredListings.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <Search className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            <button 
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Reset filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredListings.map((listing) => (
                                <Link href={`/marketplace/${listing.id}`} key={listing.id}>
                                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                            <Image
                                                fill
                                                src={listing.image}
                                                alt={listing.title}
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                </button>
                                            </div>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {listing.category}
                                                </Badge>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-medium">{listing.rating}</span>
                                                    <span className="text-xs text-slate-500">({listing.reviews})</span>
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg leading-tight line-clamp-2">
                                                {listing.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="mt-auto">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                                        <User className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-sm text-slate-600">{listing.seller}</span>
                                                </div>
                                                <div className="text-lg font-semibold text-slate-800">
                                                    {listing.price} <span className="text-sm text-slate-500">SUI</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};