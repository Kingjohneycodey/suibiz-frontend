// app/john/auth/page.tsx
"use client";
import dynamic from 'next/dynamic';

// Dynamically import EnokiWrapper with SSR disabled
const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});

// Dynamically import WalletInfo with SSR disabled
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