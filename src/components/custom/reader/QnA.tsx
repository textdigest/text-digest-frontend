'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useQnA } from '@/hooks/reader/useQnA';
import { useIsMobile } from '@/lib/use-mobile';
import { Brain, User, Sparkles, ArrowUp, Loader, CornerUpRight, X } from 'lucide-react';
import { useRef, useEffect } from 'react';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { useReaderSettings } from '@/hooks/reader/useReaderSettings';

export function QnA() {
    const { isOpen, setIsOpen, message, setMessage, conversation, isSending, handleSend } =
        useQnA();

    const { fontClass } = useReaderSettings();

    const isMobile = useIsMobile();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 192;
            textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
            textarea.style.overflowY = scrollHeight > maxHeight ? 'scroll' : 'hidden';
        }
    }, [message]);

    const content = (
        <div className='flex h-full w-full flex-col overflow-hidden py-4'>
            <main
                ref={chatRef}
                className='scrollbar-thin scrollbar-track-neutral-900 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-md pb-2'
            >
                {conversation.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col gap-1 p-2 text-sm ${
                            msg.role === 'user' ? 'items-end' : 'items-start'
                        } text-neutral-700 dark:text-neutral-300`}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[
                                rehypeKatex,
                                rehypeRaw,
                                rehypeSlug,
                                rehypeAutolinkHeadings,
                                [rehypeHighlight, { ignoreMissing: true }],
                            ]}
                            components={{
                                h1: ({ children }) => (
                                    <h1
                                        className={`mb-2 break-inside-avoid text-xl font-semibold lg:text-xl ${fontClass}`}
                                    >
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2
                                        className={`mb-2 break-inside-avoid text-lg font-semibold lg:text-lg ${fontClass}`}
                                    >
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3
                                        className={`mb-2 break-inside-avoid text-base font-semibold lg:text-base ${fontClass}`}
                                    >
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <div className={`my-2 text-lg ${fontClass}`}>
                                        {children}
                                    </div>
                                ),
                                li: ({ children }) => (
                                    <div className={`my-2 text-lg ${fontClass}`}>
                                        {children}
                                    </div>
                                ),
                                table: ({ children }) => (
                                    <table className='my-4 w-full border-collapse break-inside-avoid text-sm'>
                                        {children}
                                    </table>
                                ),
                                thead: ({ children }) => (
                                    <thead className='break-inside-avoid bg-gray-100 dark:bg-neutral-800'>
                                        {children}
                                    </thead>
                                ),
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                ))}

                {isSending && (
                    <div className='flex items-center gap-2 text-neutral-700 dark:text-neutral-300'>
                        <Sparkles size={16} />
                        <span className='text-sm'>
                            <TextShimmer>Thinking...</TextShimmer>
                        </span>
                    </div>
                )}
                <ConversationStarters />
            </main>

            <footer className='mt-auto flex flex-shrink-0 flex-col'>
                <form
                    className='relative'
                    action='submit'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend(message);
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        placeholder='Enter your question or response here...'
                        className='relative min-h-24 w-full resize-none rounded-md border border-neutral-200 bg-neutral-100 p-2 text-sm text-neutral-900 outline-none placeholder:text-sm placeholder:font-light dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(message);
                            }
                        }}
                    />
                    <motion.button
                        disabled={isSending}
                        whileTap={{ scale: 0.95 }}
                        className={`absolute right-2 bottom-4 z-50 flex h-6 w-6 items-center justify-center rounded-full ${
                            isSending
                                ? 'bg-neutral-200 text-neutral-600 opacity-80 dark:bg-neutral-800 dark:text-neutral-400'
                                : 'bg-primary-600 text-primary-50'
                        }`}
                    >
                        {isSending ? (
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
                        <DrawerTitle>Elaborate</DrawerTitle>
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
                    className='fixed top-0 right-0 z-40 h-full w-[400px] bg-neutral-900 p-6 pt-20 shadow-xl dark:bg-neutral-950'
                >
                    <X
                        className='absolute top-4 right-4 h-6 w-6 cursor-pointer text-neutral-400 hover:text-neutral-200'
                        onClick={() => setIsOpen(false)}
                    />
                    {content}
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

function ConversationStarters() {
    const { isSending, conversation, handleSend } = useQnA();

    if (conversation.length === 0 && !isSending) {
        const messages = [
            'Explain this concept further',
            'What are the key points?',
            'Summarize this section',
        ];

        return (
            <div className='mt-auto flex w-full flex-col gap-2'>
                {messages.map((msg, i) => (
                    <button
                        onClick={() => handleSend(msg)}
                        key={i}
                        className='flex items-center justify-between gap-1 rounded-md bg-neutral-100 px-4 py-2 dark:bg-neutral-800'
                    >
                        <p className='truncate text-sm text-neutral-700 dark:text-neutral-300'>
                            {msg}
                        </p>
                        <CornerUpRight className='text-neutral-500' size={20} />
                    </button>
                ))}
            </div>
        );
    }

    return null;
}
