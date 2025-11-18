'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus, ArrowUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSearch } from '@/hooks/reader/useSearch';
import { useRef, useState } from 'react';
import { useReaderSettings } from '@/hooks/reader/useReaderSettings';

type SearchMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function SearchMenu({ isOpen, onClose }: SearchMenuProps) {
    const { setSearchTerm, searchResults } = useSearch();
    const { fontClass } = useReaderSettings();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [draft, setDraft] = useState<string>('');

    const submitSearch = () => {
        if (draft.trim()) {
            setSearchTerm(draft);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className='fixed top-0 right-0 z-40 h-full w-100 bg-neutral-900 p-6 pt-20 text-white shadow-xl'
                >
                    <main className='scrollbar-hide flex h-[85%] w-full flex-col overflow-y-auto px-2 py-4'>
                        <p className='mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                            {searchResults.length} result{searchResults.length === 1 ? '' : 's'}{' '}
                            found
                        </p>
                        {searchResults.map((searchResult, index) => (
                            <div className='mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 transition-transform duration-200 hover:scale-[1.03] dark:border-neutral-800 dark:bg-neutral-900'>
                                <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                                    Page: {searchResult.page + 1}
                                </p>
                                <p
                                    className={`mt-1 text-sm text-neutral-700 dark:text-neutral-300 ${fontClass}`}
                                >
                                    "{searchResult.text}"
                                </p>
                            </div>
                        ))}
                    </main>
                    <footer className='mt-5 flex flex-shrink-0 flex-col'>
                        <form
                            className='relative'
                            action='submit'
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitSearch();
                            }}
                        >
                            <textarea
                                ref={textareaRef}
                                placeholder='Search'
                                className='relative min-h-24 w-full resize-none rounded-md border border-neutral-200 bg-neutral-100 p-2 text-base text-neutral-900 outline-none placeholder:text-sm placeholder:font-light dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500'
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submitSearch();
                                    }
                                }}
                            />
                            <motion.button
                                type='submit'
                                disabled={!draft.trim()}
                                whileTap={{ scale: 0.95 }}
                                className={`absolute right-2 bottom-4 z-50 flex h-6 w-6 items-center justify-center rounded-full ${
                                    !draft.trim()
                                        ? 'bg-neutral-200 text-neutral-600 opacity-80 dark:bg-neutral-800 dark:text-neutral-400'
                                        : 'bg-primary-600 text-primary-50'
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    submitSearch();
                                }}
                            >
                                <Search size={12} />
                            </motion.button>
                        </form>
                    </footer>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
