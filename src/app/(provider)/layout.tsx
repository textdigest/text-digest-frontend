'use client';
import { AuthProvider } from '@/hooks/auth/useAuth';
import { SearchProvider } from '@/components/providers/search-provider';
import { WebsocketProvider } from '@/components/providers/websocket-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>
                <WebsocketProvider>
                    <SearchProvider>{children}</SearchProvider>
                </WebsocketProvider>
            </AuthProvider>
        </>
    );
}
