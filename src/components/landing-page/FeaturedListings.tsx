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
    console.log("here")
    // const fetchListings = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('https://suibiz-backend.onrender.com/api/products', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     console.log("loading...")

    //     if (!response.ok) {
    //       console.error('Failed to fetch listings');
    //       return;
    //     }
        

    //     const data = await response.json();
    //     const products = data.products;


    //     console.log("products", products)

    //     const formattedListings = products.map((item: any) => ({
    //       id: item.id || 'unknown-id',
    //       title: item.name || 'Untitled',
    //       image: item.image_url || '/placeholder-image.jpg',
    //       category: item.collection || 'Uncategorized',
    //       rating: 4.5,
    //       reviews: 12,
    //       seller: `Seller ${item.owner.slice(0, 6)}`,
    //       price: `${item.price || '0.00'}`,
    //     }));

    //     setListings(formattedListings);




    //   } catch (error) {
    //     console.error('Error fetching listings:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

  }, []);

  useEffect(() => {
    const fetchAllroducts = async () => {

        
      const stores = await fetchProducts();


      console.log(stores)

      setProducts(stores.products as any)
      console.log(stores);

      setLoading(false)
    };
    fetchAllroducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader">Loading...</div>
      </div>
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
          {products.map((listing) => (
            <Link href={`/marketplace/${listing.id}`} key={listing.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
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
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
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
                  <CardTitle className="text-lg leading-tight">{listing.name}</CardTitle>
                </CardHeader>
                <CardContent>
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
                      {Number(listing.price)/1000000000} SUI
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