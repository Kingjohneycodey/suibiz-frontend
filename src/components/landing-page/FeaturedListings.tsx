"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import Image from "next/image";


export const FeaturedListings = () => {
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

  useEffect(() => {
    console.log("...")
    const fetchListings = async () => {
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

      interface ApiResponse {
        data: {
          _id: string;
          title: string;
          image: string;
          category: string;
          rating: number;
          reviews: number;
          seller: {
            name: string;
          };
          price: number;
        }[];
      }

      const listings = (data as ApiResponse).data.map((item): Listing => ({
        id: item._id,
        title: item.title,
        image: item.image,
        category: item.category,
        rating: item.rating,
        reviews: item.reviews,
        seller: item.seller.name,
        price: `$${item.price.toFixed(2)}`,
      }));

      console.log({ listings })
      setListings(listings);
    };

    fetchListings();
  }
  , []);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Featured Services & Products
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover top-rated services and products from our verified community of professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <Image
                  width={300}
                  height={200}
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
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
                <CardTitle className="text-lg leading-tight">{listing.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-600">{listing.seller}</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-800">
                    {listing.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
