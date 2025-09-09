'use client';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Page() {
    const { getIdToken } = useAuth();

    async function testBackend() {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/health`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${await getIdToken()}`,
            },
        });
    }

    return (
        <div>
            <button onClick={testBackend}>Post to health</button>
        </div>
    );
}
