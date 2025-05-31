"use client";
import LandingPage from "@/components/landing-page";
import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});



export default function Home() {
  return (
    <EnokiWrapper>
      <LandingPage />
    </EnokiWrapper>
  );
}
