"use client";
import ProductUploadPage from "@/components/dashboard/bussiness/bussiness-product-upload"
import { Suspense } from "react"
import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});

export default function UploadProductDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EnokiWrapper>
                <ProductUploadPage />
            </EnokiWrapper>
        </Suspense>
    )
}