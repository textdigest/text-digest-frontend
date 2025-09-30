'use client';
import { useState, useEffect } from 'react';
import AppSideBar from '@/components/custom/AppSideBar';
import Assistant from '@/components/custom/Assistant';
import LibraryCard from '@/components/custom/LibraryCard';

import { getTitlesAll } from '@/services/api/library/getTitlesAll';
import { getHealthCheck } from '@/services/api/health/getHealthCheck';

export default function Page() {
    const [titles, setTitles] = useState();

    useEffect(() => {
        getTitlesAll().then((i) => setTitles(i));
    }, []);

    return (
        <div
            className='flex h-screen w-screen bg-white bg-cover bg-center'
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
