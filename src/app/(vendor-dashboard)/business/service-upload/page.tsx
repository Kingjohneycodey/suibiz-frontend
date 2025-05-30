import { Suspense } from "react";
import ServiceSessionUpload from "@/components/dashboard/bussiness/bussiness-service-upload-edit";

export default function UploadServiceDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServiceSessionUpload />
        </Suspense>
    );
}