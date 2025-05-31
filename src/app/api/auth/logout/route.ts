// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export function GET() {
    const response = NextResponse.redirect(new URL('/', '/'));
    response.cookies.delete('auth_token');
    return response;
}