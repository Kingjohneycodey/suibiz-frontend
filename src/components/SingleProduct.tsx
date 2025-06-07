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
import { fetchSingleProduct } from "@/services/products";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { normalizeSuiAddress } from "@mysten/sui.js/utils";
import toast from "react-hot-toast";
import { fetchOrders } from "@/services/orders";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

interface Listing {
  id: string;
  name: string;
  photo: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  price: string;
  description?: string;
  store: {
    name: string;
    photo: string;
  };
}

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [product, setProduct] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const client = useSuiClient();
  const account = useCurrentAccount();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    const fetchListings = async () => {
      const data = await fetchSingleProduct(id);

      setProduct(data);

      setLoading(false);
      console.log(data);

      const data2 = await fetchOrders();

      console.log(data2);
    };

    fetchListings();
  }, [id]);

  const handleCreateOrder = async () => {
    if (!account) return alert("Connect wallet first");
    if (!product) return alert("Product not found");
    // if (quantity > availableQuantity) return alert("Not enough stock");

    
  try {
    const tx = new Transaction();

    tx.setGasBudget(100_000_000); 

     // Set the sender address!
     tx.setSender(account.address);

     console.log(account.address)

     const coins = await client.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });


      const totalPrice = BigInt(Number(product.price)) * BigInt(quantity);

      console.log(totalPrice)
      const paymentCoin = coins.data.find(c => BigInt(c.balance) >= totalPrice);

      console.log(paymentCoin) 

      if (!paymentCoin) {
        throw new Error(`No coin found with sufficient balance (needed ${totalPrice.toString()} MIST)`);
      }


    // Call the Move function 
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::create_order`,
      arguments: [
        tx.object(id),
        tx.pure.u64(Number(quantity)),   
        tx.object(paymentCoin.coinObjectId),
      ],
    });

    // Execute transaction if dry run succeeds
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          toast.success("Order created successfully!");
          setIsLoading(false);
          // router.push("/orders")
        },
        onError: (err) => {
          if (err.message.includes("No valid gas coins")) {
            toast.error("Insufficient balance. Fund your wallet and try again");
          } else {
            toast.error(`Order failed: ${err.message}`);
          }
          setIsLoading(false);
          console.error("Transaction Error:", err);
        },
      }
    );
  } catch (err) {
    setIsLoading(false);
    console.error("Error preparing transaction:", err);
    toast.error("Failed to prepare transaction");
  }
  };

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
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Product Not Found
          </h2>
          <Button onClick={() => router.push("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square md:aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.photo}
                alt={product.name}
                width={800}
                height={600}
                className="object-contain w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                }}
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <Badge
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-slate-800">
                {product.name}
              </h1>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">
                Description
              </h3>
              <p className="text-slate-700 whitespace-pre-line break-words leading-relaxed">
                {product.description}
              </p>
            </div>
            <hr />

            {/* Store Info Section */}
            <div className="flex items-center space-x-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sold by</p>
                <p className="font-medium text-slate-800">
                  {product.store.name}
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-800">
                {Number(product.price) / 1000000000} SUI
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">5.0</span>
                <span className="text-slate-500 text-sm">({0} reviews)</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-4 border-t border-slate-200">
              <Button
                size="lg"
                className="w-full text-lg py-6 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleCreateOrder}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
