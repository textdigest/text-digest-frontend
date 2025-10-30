'use client';
import type { ITitle } from '@/types/library';
import { Library, Search, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { SearchProvider, useSearch } from '@/components/providers/search-provider';
import { useWebsockets } from '@/components/providers/websocket-provider';

import { getTitlesAll } from '@/services/api/library/getTitlesAll';
import { deleteTitle } from '@/services/api/library/deleteTitle';
import { getTitle } from '@/services/api/library/getTitle';

import { LibraryCard } from '@/components/custom/library-card';
import { UploadTitleDialog } from '@/components/custom/upload-title-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LibraryContent() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { initSearch, search, addItem, updateItem, setSearchTerm } = useSearch();
    const { subscribe } = useWebsockets();
    const pollingIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        getTitlesAll().then((titles) => {
            initSearch(titles, ['title', 'author']);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = subscribe('library', (message) => {
            if (
                message.event === 'PROCESSING_COMPLETE' ||
                message.event === 'PROCESSING_FAILED'
            ) {
                const titleId = message.body;
                const interval = pollingIntervals.current.get(titleId);
                if (interval) {
                    clearInterval(interval);
                    pollingIntervals.current.delete(titleId);
                }

                getTitle(titleId, 'false').then((updatedTitle) => {
                    if (updatedTitle) {
                        updateItem<ITitle>(titleId, () => updatedTitle);
                    }
                });
            }
        });

        return unsubscribe;
    }, [subscribe, updateItem]);

    function startPolling(titleId: string) {
        const interval = setInterval(async () => {
            const updatedTitle = await getTitle(titleId, 'false');
            if (updatedTitle && !updatedTitle.is_processing) {
                clearInterval(interval);
                pollingIntervals.current.delete(titleId);
                updateItem<ITitle>(titleId, () => updatedTitle);
            }
        }, 3000);

        pollingIntervals.current.set(titleId, interval);

        setTimeout(() => {
            if (pollingIntervals.current.has(titleId)) {
                clearInterval(interval);
                pollingIntervals.current.delete(titleId);
            }
        }, 300000);
    }

    function handleTitleUploaded(newTitle: ITitle) {
        addItem(newTitle);
        startPolling(newTitle.id);
    }

    async function handleDeleteClick(title: ITitle) {
        await deleteTitle(title).then(() => {
            initSearch(
                search<ITitle>().filter((t) => t.id !== title.id),
                ['title', 'author'],
            );
        });
    }

    const searchedTitles = search<ITitle>();

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

                    <UploadTitleDialog onUploadComplete={handleTitleUploaded} />
                </section>

                <main className='grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4'>
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

export default function Page() {
    return (
        <SearchProvider>
            <LibraryContent />
        </SearchProvider>
    );
}
