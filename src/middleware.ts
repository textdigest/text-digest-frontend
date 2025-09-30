import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authenticatedUser } from '@/amplify';

const routes = {
    auth: ['/auth'],
    public: [],
    private: ['/reader', '/library', '/', ''],
};

export async function middleware(request: NextRequest, response: NextResponse) {
    const authenticated = await authenticatedUser({ request, response });

    const isAuthenticated = Boolean(authenticated?.user);
    const pathname = request.nextUrl.pathname;

    if (routes.private.includes(pathname) && !isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        return NextResponse.redirect(url);
    }

    if (routes.auth.includes(pathname) && isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = '/library';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
    runtime: 'nodejs',
};
