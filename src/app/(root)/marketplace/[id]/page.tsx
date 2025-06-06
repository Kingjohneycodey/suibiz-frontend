
"use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Star, User } from "lucide-react";
// import Image from "next/image";

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
