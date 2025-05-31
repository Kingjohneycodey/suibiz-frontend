"use client";
import ViewProfile from '@/components/ViewProfile';
import dynamic from 'next/dynamic';


const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});


export default function BusinessProfile() {
    return (
        <EnokiWrapper>
            <ViewProfile />
        </EnokiWrapper>
    );
}