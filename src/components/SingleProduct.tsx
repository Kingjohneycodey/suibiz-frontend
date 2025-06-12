"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Star, User, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing-page/Header";
import { Footer } from "@/components/landing-page/Footer";
import { fetchSingleProduct } from "@/services/products";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import toast from "react-hot-toast";
// import { fetchOrders } from "@/services/orders";
import { Transaction } from "@mysten/sui/transactions";
import { useUserStore } from "../../stores/userStore";
import Link from "next/link";

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
  available_items: []
}

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [product, setProduct] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [showSignup, setShowSignup] = useState(false);

  const client = useSuiClient();
  const account = useCurrentAccount();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const { user } = useUserStore()

  console.log(user)

  useEffect(() => {
    console.log('Current wallet connection status:', {
      currentAccount
    });

    if (!currentAccount && !sessionStorage.getItem("refreshed3")) {
      sessionStorage.setItem("refreshed3", "true")
      window.location.reload()
    }
  }, [currentAccount]);

  useEffect(() => {
    const fetchListings = async () => {
      const data = await fetchSingleProduct(id);
      setProduct(data);
      setLoading(false);
    };

    fetchListings();
  }, [id]);

  const handleCreateOrder = async () => {
    if (user?.role == null) {
      setLoading(false)
      setShowSignup(true)
      console.log("ewrew")
      return
    }

    if (!account) return alert("Connect wallet first");
    if (!product) return alert("Product not found");
    if (quantity > product.available_items.length) return alert("Not enough stock");


    try {
      const tx = new Transaction();



      // tx.setGasBudget(100_000_000);

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
        toast.error(`No coin found with sufficient balance (needed ${totalPrice.toString()} MIST), Fund your sui address with testnet tokens and try again`);
        return;
      }


      // Call the Move function 
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::marketplace::create_order`,
        arguments: [
          tx.object(id),
          tx.pure.u64(Number(quantity)),
          tx.object(paymentCoin.coinObjectId),
        ]
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
            setShowDialog(false);
            router.push("/user/orders")
          },
          onError: (err) => {
            if (err.message.includes("No valid gas coins")) {
              toast.error("No valid gas coins. Fund your wallet with new gas tokens and try again");
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
          <div className="space-y-4">
            <Button onClick={() => router.push("/marketplace")}>
              Back to Marketplace
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="ml-4"
            >
              Back to Register
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="flex flex-col">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.photo}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                    }}
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm">
                      {product.category}
                    </Badge>
                  </div>
                </div>                
              </div>
  
              <div className="flex flex-col space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">(0 reviews)</span>
                  </div>
                </div>
  
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sold by</p>
                          <p className="font-medium text-gray-900">
                            {product.store.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Available</p>
                        <p className="font-medium text-gray-900">
                          {product.available_items.length} items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Number(product.price) / 1000000000} SUI
                      </p>
                    </div>
                  </div>
  
                  <Button
                    size="lg"
                    className="w-full py-6 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all"
                    onClick={() => setShowDialog(true)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <Dialog open={showDialog} onOpenChange={() => {
        setShowSignup(false)
        setShowDialog(false)
      }}>
        {!showSignup ? (
          <DialogContent className="sm:max-w-md bg-white rounded-xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Confirm your order
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please review your purchase details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="relative">
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={product?.available_items.length || 1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product?.available_items.length || 1)))}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-3 text-sm text-gray-500">
                    Max: {product?.available_items.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {(Number(product.price) / 1000000000 * quantity).toFixed(2)} SUI
                  </span>
                </div>
              </div>
              
              <Button
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={() => {
                  setIsLoading(true);
                  handleCreateOrder();
                }}
                disabled={isLoading || quantity < 1 || quantity > (product?.available_items.length || 0)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Purchase"
                )}
              </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-md bg-white rounded-xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Account Required
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                You need an account to complete your purchase
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                Create an account to save your purchase history and preferences.
              </p>
              
              <div className="space-y-3">
                <Link href="/register" className="block">
                  <Button className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    Create Account
                  </Button>
                </Link>
                
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full py-6 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Sign In to Existing Account
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </div>
  );
}
