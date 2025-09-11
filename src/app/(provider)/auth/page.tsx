'use client';
import { useAuth } from '@/hooks/auth/useAuth';
import { GoogleIcon } from '@/svg/google-icon';

export default function Page() {
    const { signInWithGoogle } = useAuth();

    return (
        <div>
            <button className='bg-primary-700' onClick={signInWithGoogle}>
                signin
            </button>
        </div>
    );
}
