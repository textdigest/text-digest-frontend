'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useAnnotate } from '@/hooks/reader/useAnnotate';
import { useIsMobile } from '@/lib/use-mobile';
import { NotebookPen, ArrowUp, X, Loader } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useReaderSettings } from '@/hooks/reader/useReaderSettings';

export function Annotate() {
    const { isOpen, setIsOpen, text, setText, highlightedText, handleSave, isSaving } = useAnnotate();

    const { fontClass } = useReaderSettings();

    const isMobile = useIsMobile();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 192;
            textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
            textarea.style.overflowY = scrollHeight > maxHeight ? 'scroll' : 'hidden';
        }
    }, [text]);

    const content = (
        <div className='flex h-full w-full flex-col overflow-hidden py-4'>
            {highlightedText && (
                <div className='mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900'>
                    <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                        Selected text:
                    </p>
                    <p className={`mt-1 text-sm text-neutral-700 dark:text-neutral-300 ${fontClass}`}>
                        "{highlightedText}"
                    </p>
                </div>
            )}

            <main className='scrollbar-thin scrollbar-track-neutral-900 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-md pb-2'>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                        Add your annotation below:
                    </p>
                </div>
            </main>

            <footer className='mt-auto flex flex-shrink-0 flex-col'>
                <form
                    className='relative'
                    action='submit'
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (text && text.trim() && !isSaving) {
                            await handleSave();
                        }
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        placeholder='Enter your annotation here...'
                        className='relative min-h-24 w-full resize-none rounded-md border border-neutral-200 bg-neutral-100 p-2 text-sm text-neutral-900 outline-none placeholder:text-sm placeholder:font-light dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (text && text.trim() && !isSaving) {
                                    console.log("Press registered");
                                    await handleSave();
                                }
                            }
                        }}
                    />
                    <motion.button
                        type="submit"
                        disabled={!text.trim() || isSaving}
                        whileTap={{ scale: 0.95 }}
                        onClick={async (e) => {
                            e.preventDefault();
                            if (text && text.trim() && !isSaving) {
                                await handleSave();
                            }
                        }}
                        className={`absolute right-2 bottom-4 z-50 flex h-6 w-6 items-center justify-center rounded-full ${
                            !text.trim() || isSaving
                                ? 'bg-neutral-200 text-neutral-600 opacity-80 dark:bg-neutral-800 dark:text-neutral-400'
                                : 'bg-primary-600 text-primary-50'
                        }`}
                    >
                        {isSaving ? (
                            <Loader className='animate-spin' size={18} />
                        ) : (
                            <ArrowUp size={18} />
                        )}
                    </motion.button>
                </form>
            </footer>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className='flex h-[75svh] flex-col gap-2 px-4'>
                    <DrawerHeader className='hidden'>
                        <DrawerTitle>Annotate</DrawerTitle>
                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className='fixed top-0 right-0 z-40 h-full w-[32rem] border-l border-neutral-800 bg-neutral-900 p-6 pt-20 shadow-xl dark:bg-neutral-950'
                >
                    <X
                        className='h-6 w-6 cursor-pointer text-neutral-400 hover:text-neutral-200'
                        onClick={() => setIsOpen(false)}
                    />
                    {content}
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

