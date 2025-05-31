
"use client";

import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState, useEffect } from 'react';

export default function ViewProfile() {
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction, isPending, error } = useSignAndExecuteTransaction();
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    // Log current account for debugging
    useEffect(() => {
        handleListItem()
    }, [currentAccount]);

    // Function to execute the moveCall
    const handleListItem = async () => {
        if (!currentAccount) {
            setTransactionStatus('Please connect your wallet.');
            return;
        }

        try {
            const tx = new TransactionBlock();
            tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::user::get_profile_id_by_owner`,
                arguments: [
                    tx.object(`${process.env.NEXT_PUBLIC_REGISTRY_ID}`),
                    tx.pure(currentAccount.address, 'address'), // Use the connected wallet address
                ],
            });


            signAndExecuteTransaction(
                {
                    transaction: tx.serialize(),
                    chain: 'sui:devnet', // Adjust to 'sui:testnet' or other network as needed
                },
                {
                    onSuccess: (result) => {
                        setTransactionStatus(`Transaction successful: ${JSON.stringify(result)}`);
                        console.log('Transaction Digest:', result);
                    },
                    onError: (err) => {
                        setTransactionStatus(`Transaction failed: ${err.message}`);
                        console.error('Transaction Error:', err);
                    },
                }
            );
        } catch (err) {
            setTransactionStatus('Error preparing transaction.');
            console.error('Error preparing transaction:', err);
        }
    };

    return (
        <div>
            <h2>Wallet Info</h2>
            <ConnectButton /> {/* Button to connect wallet */}
            {currentAccount ? (
                <div>
                    <p>Connected Address: {currentAccount.address}</p>
    
                    {transactionStatus && <p>{transactionStatus}</p>}
                    {error && <p>Error: {error.message}</p>}
                </div>
            ) : (
                <p>No wallet connected.</p>
            )}
        </div>
    );
}