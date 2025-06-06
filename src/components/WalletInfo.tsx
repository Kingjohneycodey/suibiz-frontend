
"use client";

import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState, useEffect } from 'react';

export default function WalletInfo() {
    // const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction, isPending, error } = useSignAndExecuteTransaction();
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    // useEffect(() => {
    //     console.log('Current Account:', currentAccount);
    // }, [currentAccount]);

    const handleListItem = async () => {
        // if (!currentAccount) {
        //     setTransactionStatus('Please connect your wallet.');
        //     return;
        // }

        // try {
        //     const tx = new TransactionBlock();
        //     tx.moveCall({
        //         target: '0x7eebe9828691e73dfba53b5e7f1f3135db31ede4883492bdc1184d238235176c::marketplace::list_product',
        //         arguments: [
        //             tx.object('0x9f358096b22c08d8deaf87e08885dec57b7ac4935f5b7dee934c8c6c1a9da0b2'), // the product object
        //             tx.pure('prod-123'),   
        //             tx.pure(2000),         
        //             tx.pure('collectibles')
        //         ],
        //     });


        //     signAndExecuteTransaction(
        //         {
        //             transaction: tx.serialize(),
        //             chain: 'sui:testnet', // Adjust to 'sui:testnet' or other network as needed
        //         },
        //         {
        //             onSuccess: (result) => {
        //                 setTransactionStatus(`Transaction successful: ${result.digest}`);
        //                 console.log('Transaction Digest:', result.digest);
        //             },
        //             onError: (err) => {
        //                 setTransactionStatus(`Transaction failed: ${err.message}`);
        //                 console.error('Transaction Error:', err);
        //             },
        //         }
        //     );
        // } catch (err) {
        //     setTransactionStatus('Error preparing transaction.');
        //     console.error('Error preparing transaction:', err);
        // }
    };

    return (
        <div>
            <h2>Wallet Info</h2>
            {/* <ConnectButton /> Button to connect wallet */}
            {/* {currentAccount ? (
                <div>
                    <p>Connected Address: {currentAccount.address}</p>
                    <button onClick={handleListItem} disabled={isPending}>
                        {isPending ? 'Processing...' : 'List NFT'}
                    </button>
                    {transactionStatus && <p>{transactionStatus}</p>}
                    {error && <p>Error: {error.message}</p>}
                </div>
            ) : (
                <p>No wallet connected.</p>
            )} */}
        </div>
    );
}