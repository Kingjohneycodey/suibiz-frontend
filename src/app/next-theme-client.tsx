'use client';

import dynamic from 'next/dynamic'

const Providers = dynamic(() => import('./providers').then(mod => mod.ThemeProvider), {
    ssr: false,
})



export default function NextThemeClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    )
} 