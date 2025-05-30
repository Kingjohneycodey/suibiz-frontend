"use client";
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export default function WalletInfo() {
    const currentAccount = useCurrentAccount();

    console.log('Current Account:', currentAccount);

    return (
        <div>
            {currentAccount ? (
                <div>
                    <p>Active Wallet Address: {currentAccount.address}</p>
                    <ConnectButton />
                </div>
            ) : (
                <p>No wallet connected. Please sign in with Google.<ConnectButton /></p>
            )}
        </div>
    );
}