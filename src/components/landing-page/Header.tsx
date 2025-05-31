"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ConnectButton } from "@mysten/dapp-kit";


interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        
        if (!response.ok) throw new Error('Failed to fetch session');

        const data = await response.json();
        console.log('Session data:', data);

        if (data.data.user) {
          console.log('User session:', data.user);
          setUser(data.data.user);
        } 
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const handleSignIn = () => router.push('/api/auth/google');
  

  if (loading) {
    return <div className="flex items-center justify-center h-16">Loading...</div>;
  }


  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SuiBiz
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">Explore</a>
            <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">Services</a>
            <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">How it Works</a>
            <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            {user ? (
              // <Button 
              //   onClick={handleConnectWallet}
              //   className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              // >
              //   <Wallet className="w-4 h-4 mr-2" />
              //   Connect Wallet
              // </Button>
              <ConnectButton />
            ) : (
              <Button 
                onClick={handleSignIn} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Sign in
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">Explore</a>
              <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">Services</a>
              <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">How it Works</a>
              <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">About</a>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                {user ? (
                  // <Button 
                  //   onClick={handleConnectWallet}
                  //   className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  // >
                  //   <Wallet className="w-4 h-4 mr-2" />
                  //   Connect Wallet
                  // </Button>
                  <ConnectButton />
                ) : (
                  <Button 
                    onClick={handleSignIn} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};