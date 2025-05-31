
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import Image from "next/image";

export const FeaturedListings = () => {
  const listings = [
    {
      id: 1,
      title: "Custom DeFi Dashboard Design",
      seller: "CryptoDesigner",
      price: "50 SUI",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      category: "Design"
    },
    {
      id: 2,
      title: "Smart Contract Audit",
      seller: "BlockchainExpert",
      price: "200 SUI",
      rating: 5.0,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop",
      category: "Development"
    },
    {
      id: 3,
      title: "NFT Collection Launch Strategy",
      seller: "NFTGuru",
      price: "75 SUI",
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=300&h=200&fit=crop",
      category: "Marketing"
    },
    {
      id: 4,
      title: "Web3 Consulting Session",
      seller: "DecentLabs",
      price: "30 SUI",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
      category: "Consulting"
    }
  ];

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
