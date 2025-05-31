"use client";
import { useSession } from '../../hooks/useSession';
import Image from 'next/image';

export function UserProfile() {
    const { user, loading } = useSession();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please sign in</div>;
    }

    return (
        <div className="flex items-center gap-4">
        {user.picture && (
            <Image
                width={40}
                height={40}
                src={user.picture} 
                alt="User avatar" 
                className="w-10 h-10 rounded-full" 
            />
        )}
        <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        </div>
    );
}