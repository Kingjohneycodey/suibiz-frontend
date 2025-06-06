"use client";
import { getUserProfileInfo } from "@/services/profile";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../../stores/userStore";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const { setUser } = useUserStore()
    const [isMounted, setIsMounted] = useState(false);
    const { currentWallet } = useCurrentWallet()
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const exist = sessionStorage.getItem('@enoki/flow/session/enoki_public_e5a1d53741cdbe61403b4c6de297ca10/testnet');
            console.log("Session existence check →", { exist });
        }
    }, []);



    console.log(currentWallet)

    const currentWalletAddress = currentWallet?.accounts[0]?.address


    useEffect(() => {
        if(currentWalletAddress){
            async function getUserProfile() {   
                const data = await getUserProfileInfo(currentWalletAddress || "")
                console.log(data)

                setUser(data)
            }
            getUserProfile()
        }
    }, [currentWallet])

 
    if (!isMounted) {
        return null;
    }

   
    if(!currentWallet){
        return (
            <div>
                <ConnectButton/>
            </div>
        )
    }

    return (
        <div>
            
            { children }
        </div>
    );
}