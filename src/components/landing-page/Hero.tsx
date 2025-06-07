import { Button } from "@/components/ui/button";
import { Shield, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "../../../stores/userStore";

export const Hero = () => {
  const { user } = useUserStore();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            The Future of Decentralized Commerce
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Buy and sell products, book services, and build trust on the Sui
            blockchain. Experience true ownership with secure escrow, NFT
            reviews, and community governance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/marketplace">
              <Button
                size="lg"
                className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
              >
                Explore Marketplace
              </Button>
            </Link>

            {user?.role ? (
              <Link href="/business">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-2"
                >
                  Start Selling
                </Button>
              </Link>
            ) : (
              <a href="/business/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-2"
                >
                  Start Selling
                </Button>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Secure Escrow
              </h3>
              <p className="text-slate-600 text-sm">
                Smart contract protection for every transaction
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">NFT Reviews</h3>
              <p className="text-slate-600 text-sm">
                Permanent, verifiable reputation system
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Low Fees</h3>
              <p className="text-slate-600 text-sm">
                Maximize earnings with minimal platform costs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
