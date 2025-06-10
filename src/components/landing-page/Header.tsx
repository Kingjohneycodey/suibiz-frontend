"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "../../../stores/userStore";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();

  const handleSignout = async () => {
  };

  console.log(user)



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => setSearchQuery("");

  console.log(account?.address)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="animate-pulse h-8 w-32 rounded-md bg-slate-200" />
      </div>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/dark-logo.svg"
                alt="SuiBiz Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Link
              href="/marketplace"
              className="text-[#010725] hover:text-purple-600 transition-colors font-medium text-sm"
            >
              Marketplace
            </Link>
            <Link
              href="/services"
              className="text-[#010725] hover:text-purple-600 transition-colors font-medium text-sm"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="text-[#010725] hover:text-purple-600 transition-colors font-medium text-sm"
            >
              How it Works
            </Link>
            <Link
              href="/about"
              className="text-[#010725] hover:text-purple-600 transition-colors font-medium text-sm"
            >
              About
            </Link>
          </nav>

          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <form onSubmit={handleSearch} className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* {user ? (
              <div className="flex items-center space-x-3">
                <ConnectButton 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm"
                />
                <Button
                  onClick={handleSignout}
                  variant="ghost"
                  className="text-[#010725] hover:bg-slate-100 font-medium rounded-lg"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleSignIn} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm px-4"
              >
                Sign in
              </Button>
            )} */}

        <div>
          {user?.role ? (
            <div>
              {/* <p>{user.username}</p> */}

              {user.role === "business" ? (
                <Link href="/business">
                  <Button
                    size="lg"
                    className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : user.role === "user" ? (
                <Link href="/user">
                  <Button
                    size="lg"
                    className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : account !== null ? (
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm px-4">
                Sign Up
              </Button>
            </Link>
          ) : (
            <ConnectButton className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 !text-white font-medium rounded-lg shadow-sm" />
          )}
        </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#010725] hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200/50">
            <div className="px-2 pt-3 space-y-3">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>

              <nav className="flex flex-col space-y-2 pt-1">
                <Link
                  href="/marketplace"
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#010725] hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/services"
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#010725] hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#010725] hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#010725] hover:bg-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </nav>

              <div className="pt-2 space-y-2">
                {/* {user ? (
                  <>
                    <ConnectButton 
                      className="w-full justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm"
                    />
                    <Button
                      onClick={handleSignout}
                      variant="outline"
                      className="w-full text-[#010725] hover:bg-slate-100 font-medium rounded-lg"
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleSignIn} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm"
                  >
                    Sign in
                  </Button>
                )} */}

                {/* <div>
                  {user && (
                    <div>
                      <p>{user.username}</p>
                    </div>
                  )}
                </div> */}
                <div>
              {user?.role ? (
                <div>
                  {/* <p>{user.username}</p> */}

                  {user?.role === "business" && (
                    <Link href="/business">
                      <Button
                        size="lg"
                        className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              ) : account !== null ? (

            <Link href="/register">
            
            <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm px-4"
              >
                Sign Up
              </Button>
            </Link>
              ) :(
                <ConnectButton className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 !text-white font-medium rounded-lg shadow-sm" />
              )}
            </div>

                {/* <ConnectButton className="w-full justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm" /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
