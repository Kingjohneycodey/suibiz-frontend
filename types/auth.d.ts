declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
            NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
            NEXT_PUBLIC_NEXTAUTH_URL: string;
            NEXT_PUBLIC_JWT_SECRET: string;
        }
    }
}

export interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token: string;
}

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    picture: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}