'use client';
import { AuthProvider } from '@/hooks/auth/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>{children}</AuthProvider>
        </>
    );
}
