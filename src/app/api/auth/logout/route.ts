import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_NEXTAUTH_URL));
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });
    return response;
}