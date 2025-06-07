import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApiResponse, SessionUser } from '../../../../../types/auth';


export async function GET(request: NextRequest) {
    const session = getSession(request);
    
    const response: ApiResponse<{ user: SessionUser | null }> = {
        data: { user: session },
    };
    return NextResponse.json(response);
}