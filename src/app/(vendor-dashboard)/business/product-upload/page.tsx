"use client";
import ProductUploadPage from "@/components/dashboard/bussiness/bussiness-product-upload";
import CreateStorePage from "@/components/dashboard/bussiness/business-create-store";
import { getAllStores } from "@/services/business";
import { Suspense, useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit"; // Assuming you're using this for wallet

export default function UploadProductDashboard() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentWallet = useCurrentAccount(); // Gets the connected wallet address

  const userAddress = currentWallet?.address?.toLowerCase();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getAllStores();
        console.log(data)
        setStores(data || []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Check if any store belongs to the connected user
  const userHasStore = stores.some(
    (storeObj) => storeObj.store?.owner?.toLowerCase() === userAddress
  );

  const userStore = stores.find(store => store.store?.owner?.toLowerCase() === userAddress);

  console.log(userStore)

  return (
    <Suspense fallback={<div className="dark:bg-gray-900 text-black" >Loading...</div>}>
      {isLoading ? (
        <div className="dark:bg-gray-900 h-screen dark:text-white">Loading...</div>
      ) : userHasStore ? (
        <ProductUploadPage kioskId={userStore?.store?.kiosk_id} />
      ) : (
        <CreateStorePage />
      )}
    </Suspense>
  );
}
