import jwt from 'jsonwebtoken';
import { SessionUser } from '../../types/auth';
import { NextRequest } from 'next/server';

export function verifyToken(token: string): SessionUser | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET) as SessionUser;
    } catch (error) {
        return null;
    }
}

export function getSession(req: NextRequest): SessionUser | null {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;

    console.log({token})
    return verifyToken(token);
}

// Client-side session check
export async function checkSession(): Promise<SessionUser | null> {
    try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.user || null;
    } catch (error) {
        return null;
    }
}