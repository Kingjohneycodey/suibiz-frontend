import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleTokenResponse, GoogleUser, SessionUser } from '../../../../../../types/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');
        const code = searchParams.get('code');
        const cookie = request.headers.get('cookie');
        const oauthState = cookie?.split(';').find(c => c.trim().startsWith('oauth_state='))?.split('=')[1];

        if (!state || !oauthState || state !== oauthState) {
            return NextResponse.json(
                { error: 'Invalid state' },
                { status: 401 }
            );
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/callback/google`,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to fetch tokens');
        }

        const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { 
                Authorization: `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const user = (await userResponse.json()) as GoogleUser;

        const sessionUser: SessionUser = {
            id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
        };

        const token = jwt.sign(
            sessionUser,
            process.env.NEXT_PUBLIC_JWT_SECRET,
            { expiresIn: '1h' }
        );

        const response = NextResponse.redirect(new URL('/', request.url));

        // Set cookies
        response.cookies.set({
            name: 'auth_token',
            value: token,
            path: '/',
            httpOnly: false,
            secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
        });

        response.cookies.delete('oauth_state');

        return response;
    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}