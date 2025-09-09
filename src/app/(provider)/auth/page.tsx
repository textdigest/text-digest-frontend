'use client';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Page() {
    const { signInWithGoogle } = useAuth();

    return (
        <div>
            <button onClick={signInWithGoogle}>signin</button>
        </div>
    );
}
