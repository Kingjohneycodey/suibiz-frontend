

"use client";

import dynamic from 'next/dynamic';

const EnokiWrapper = dynamic(() => import('@/components/EnokiWrapper'), {
    ssr: false,
});



export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <EnokiWrapper>
{children}
    </EnokiWrapper>
  );
}
