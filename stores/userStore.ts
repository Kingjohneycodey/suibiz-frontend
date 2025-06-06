
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
    id: string;
    name: string;
    username: string;
    role: string;
    photo: string;
    address: string;
    bio: string;
};

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    getUser: () => User | null;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            
            setUser: (user: User) => set({ user }),
            
            clearUser: () => set({ user: null }),
            
            getUser: () => get().user
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);