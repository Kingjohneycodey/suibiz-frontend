"use client";
import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});

const WalletInfo = dynamic(() => import('@/components/WalletInfo'), {
    ssr: false,
});

export default function Wallet() {
    return (
        <EnokiWrapper>
            <WalletInfo />
        </EnokiWrapper>
    );
}