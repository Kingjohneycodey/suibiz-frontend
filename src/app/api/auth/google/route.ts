import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

export function GET() {
    const state = randomBytes(16).toString('hex');

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/callback/google`,
        response_type: 'code',
        scope: 'openid email profile',
        state: state,
        access_type: 'offline',
        prompt: 'consent',
    });

    const response = NextResponse.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    );

    response.cookies.set({
        name: 'oauth_state',
        value: state,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 10,
    });

    return response;
}