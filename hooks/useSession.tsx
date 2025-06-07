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

                setUser(data?.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, []);

    return { user, loading };
}