"use client";
import { getUserProfileInfo } from "@/services/profile";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../../stores/userStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const { currentWallet } = useCurrentWallet();
  const [showConnectDialog, setShowConnectDialog] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const exist = sessionStorage.getItem(
        "@enoki/flow/session/enoki_public_e5a1d53741cdbe61403b4c6de297ca10/testnet"
      );
      console.log("Session existence check →", { exist });

      const loggedIn = localStorage.getItem("loggedIn") === "true";
      setLoggedIn(loggedIn);
    }
  }, []);

  console.log(currentWallet);

  const currentWalletAddress = currentWallet?.accounts[0]?.address;

  useEffect(() => {
    if (currentWalletAddress) {
      async function getUserProfile() {
        const data = await getUserProfileInfo(currentWalletAddress || "");
        console.log(data);
        setUser(data);
        setShowConnectDialog(false);
      }
      getUserProfile();
    }
  }, [currentWallet]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {children}

      {!currentWallet && loggedIn && (
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Please connect your wallet to continue using the application.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <ConnectButton
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 !text-white font-medium rounded-lg shadow-sm"
                onClick={() => {
                  localStorage.setItem("loggedIn", "true");
                }}
              />
            </div>
          </DialogContent>
        </Dialog> 
      )}
    </div>
  );
}
