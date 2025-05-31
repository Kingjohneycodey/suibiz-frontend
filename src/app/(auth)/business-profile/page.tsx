"use client";
import dynamic from 'next/dynamic';
import BusinessProfilePage from './business-profile-com';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});


export default function BusinessProfile() {
  return (
    <EnokiWrapper>
      <BusinessProfilePage />
    </EnokiWrapper>
  );
}