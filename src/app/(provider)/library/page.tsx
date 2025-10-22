'use client';
import type { ITitle } from '@/types/library';
import { Library, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchProvider, useSearch } from '@/components/providers/search-provider';

import { getTitlesAll } from '@/services/api/library/getTitlesAll';
import { deleteTitle } from '@/services/api/library/deleteTitle';
//import { mockTitles } from '@/data/mock-titles';

import { LibraryCard } from '@/components/custom/library-card';
import { UploadTitleDialog } from '@/components/custom/upload-title-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { initSearch, search, setSearchTerm } = useSearch();

    useEffect(() => {
        getTitlesAll().then((titles) => {
            initSearch(titles, ['title', 'author']);
            setIsLoading(false);
        });
    }, []);

    const searchedTitles = search<ITitle>();

    async function handleDeleteClick(title: ITitle) {
        await deleteTitle(title).then(() => {
            initSearch(
                search<ITitle>().filter((t) => t.id !== title.id),
                ['title', 'author'],
            );
        });
    }

    return (
        <div className='flex h-screen w-screen justify-center overflow-y-scroll dark:bg-neutral-950'>
            <div className='flex h-full w-full max-w-4xl flex-col px-2 py-4 md:px-8 md:py-16'>
                <header>
                    <h1 className='to-primary-800 from-primary-400 dark:to-primary-400 dark:from-primary-50 flex items-center gap-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                        <Library className='stroke-primary-50' size={48} />
                        My Library
                    </h1>
                </header>

                <section className='flex w-full justify-between gap-4 py-4'>
                    <div className='relative w-96 max-w-full'>
                        <Input
                            className='pl-10 placeholder:font-light'
                            placeholder='Search by title or author name'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 dark:text-neutral-600' />
                    </div>

                    <UploadTitleDialog />
                </section>

                <main className='flex flex-wrap gap-8 py-4'>
                    {searchedTitles.map((title) => (
                        <LibraryCard
                            onDelete={handleDeleteClick}
                            key={title.id}
                            title={title}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
}
