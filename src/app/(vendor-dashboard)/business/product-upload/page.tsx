import ProductUploadPage from "@/components/dashboard/bussiness/bussiness-product-upload"
import { Suspense } from "react"

export default function UploadProductDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductUploadPage />

        </Suspense>
    )
}