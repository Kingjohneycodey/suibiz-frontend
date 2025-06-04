"use client"
import { MarketPlace } from "@/components/landing-page/Marketplace";

import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});



export default function MarketplacePage() {
    return (
         <EnokiWrapper>
            <MarketPlace />
        </EnokiWrapper>
    );
}
