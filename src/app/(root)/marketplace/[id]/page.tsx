"use client"
import SingleProductPage from "@/components/SingleProduct";

import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});



export default function MarketplacePage() {
    return (
         <EnokiWrapper>
            <SingleProductPage />
        </EnokiWrapper>
    );
}
