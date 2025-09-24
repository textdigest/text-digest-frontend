'use client';
import AppSideBar from '@/components/custom/AppSideBar';
import Assistant from '@/components/custom/Assistant';
import LibraryCard from '@/components/custom/LibraryCard';
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
        <div
            className='flex min-h-screen w-[100%] bg-white bg-cover bg-center'
            style={{ backgroundImage: "url('/Background.png')" }}
        >
            <AppSideBar currentRoute='Library' />
            <Assistant />
            <LibraryCard />
            <LibraryCard />
            <LibraryCard />
            <LibraryCard />
        </div>
    );
}
