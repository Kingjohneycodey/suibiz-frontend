"use client";
import { useEffect, useState } from 'react';
import { SessionUser } from '../types/auth';


export function useSession() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch('/api/auth/session');
                const data = await response.json();

                console.log({ data })
                setUser(data?.user);
            } catch (error) {
                console.error('Session check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, []);

    return { user, loading };
}