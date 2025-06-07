"use client"
import UserWallet from "@/components/dashboard/user/UserWallet";
import { Transaction } from "../../../../../types/wallet";
import { useEffect, useState } from "react";
import { ConnectButton, useCurrentAccount, useCurrentWallet, useSuiClient } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";


export default function VendorWalletPage() {
    const vendorData: Transaction[] = [
        {
            id: 1,
            invoiceId: 'INV-2023-001',
            name: 'Service Payment',
            type: 'deposit',
            amount: 1000,
            currency: 'SUI',
            date: '2023-05-15',
            status: 'completed'
        },
        {
            id: 2,
            invoiceId: 'INV-2023-002',
            name: 'Withdrawal Request',
            type: 'withdrawal',
            amount: 250,
            currency: 'USDC',
            date: '2023-05-10',
            status: 'completed'
        },
        {
            id: 3,
            invoiceId: 'INV-2023-003',
            name: 'Escrow Deposit',
            type: 'escrow',
            amount: 500,
            currency: 'SUI',
            date: '2023-05-05',
            status: 'pending'
        },
        {
            id: 4,
            invoiceId: 'INV-2023-004',
            name: 'Freelance Work',
            type: 'deposit',
            amount: 750,
            currency: 'USDC',
            date: '2023-05-20',
            status: 'completed'
        },
        {
            id: 5,
            invoiceId: 'INV-2023-005',
            name: 'Platform Fee',
            type: 'withdrawal',
            amount: 50,
            currency: 'SUI',
            date: '2023-05-18',
            status: 'completed'
        },
    ];

    const [balance, setBalance] = useState(0);

    const { currentWallet } = useCurrentWallet()

    const currentAccount = currentWallet?.accounts[0]?.address


    const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    useEffect(() => {
        const fetchBalance = async () => {
            if (!currentAccount) return;

            const data = await client.getBalance({
                owner: currentAccount || "",
            });

            setBalance(Number(data.totalBalance)/1000000000)
        };

        fetchBalance();
    }, [currentAccount]);

    return (
        <div className="space-y-6">
            <UserWallet
                transactions={vendorData}
                balance={balance}
            />
        </div>
    );
}