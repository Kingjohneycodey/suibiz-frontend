"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/services/products";

export const FeaturedListings = () => {
  interface Product {
    id: string;
    name: string;
    photo: string;
    category: string;
    available_items: any[];
    creator: string;
    price: string;
    store: {
      name: string;
      photo: string;
    }
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllProducts = async () => {

      const stores = await fetchProducts();

      console.log(stores)

      setProducts(stores.products as any)
      console.log(stores);

      setLoading(false)
    };
    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <>
        <div className="text-center mb-12 py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Featured Services & Products
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover top-rated services and products from our verified community of professionals
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="loader text-black">Loading...</div>
        </div>
      </>
    );
  }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((listing) => (
            <Link href={`/marketplace/${listing.id}`} key={listing.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="h-80 overflow-hidden rounded-t-lg">
                  <Image
                    width={300}
                    height={200}
                    src={listing.photo}
                    alt={listing.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <CardHeader className="pb-2 px-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {listing.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">5</span>
                      {/* <span className="text-sm font-medium">{listing.rating}</span> */}
                      {/* <span className="text-xs text-slate-500">({listing.reviews || 0})</span> */}

                      <span className="text-xs text-slate-500">({0})</span>
                    </div>
                  </div>
                  <div className="flex text-gray-900 items-center justify-between">
                    <CardTitle className="text-lg leading-tight py-2">{listing.name}</CardTitle>

                    <div>
                      ({listing.available_items.length} items)
                    </div>

                  </div>
                </CardHeader>
                <CardContent className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div> */}
                      <div>
                        <Image
                          width={10}
                          height={10}
                          src={listing.store.photo}
                          alt={listing.store.name}
                          className="w-10 h-10 rounded-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{listing.store.name}</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-800">
                      {(Number(listing.price) / 1000000000).toFixed(7)} SUI
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};