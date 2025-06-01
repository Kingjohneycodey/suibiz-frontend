"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing-page/Header";
import { Footer } from "@/components/landing-page/Footer";



interface Listing {
    id: string;
    title: string;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    seller: string;
    price: string;
    description?: string;
}

export default function SingleProductPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };

    const [product, setProduct] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(
                    "https://suibiz-backend.onrender.com/api/products",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                const products = data.products;

                const formattedListings: Listing[] = products.map((item: any) => ({
                    id: item.id || "unknown-id",
                    title: item.name || "Untitled",
                    image: item.image_url || "/placeholder-image.jpg",
                    category: item.collection || "Uncategorized",
                    rating: 4.5,
                    reviews: 12,
                    seller: `Seller ${item.owner?.slice(0, 6) || "Unknown"}`,
                    price: `${item.price || "0.00"}`,
                    description: item.description || "No description provided.",
                }));

                const found = formattedListings.find((p) => p.id === id);
                setProduct(found || null);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchListings();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                <span className="text-slate-500 text-lg">Loading...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Product Not Found</h2>
                    <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Product Image */}
                    <div className="flex flex-col items-center">
                        <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                            <Image
                                src={product.image}
                                alt={product.title}
                                width={600}
                                height={400}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                }}
                                priority
                            />
                        </div>
                    </div>
                    {/* Product Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <Badge variant="default" className="mb-3">{product.category}</Badge>
                            <h1 className="text-3xl font-bold mb-2 text-slate-800">{product.title}</h1>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-slate-500 text-sm">({product.reviews} reviews)</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-base text-slate-600">{product.seller}</span>
                            </div>
                            <p className="text-slate-700 mb-8">{product.description}</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-2xl font-bold text-slate-800">{product.price} sui</span>
                            </div>
                            <Button className="w-full text-lg py-6 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Buy Now</Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}