'use client';
import type { BBox, Document, Asset, Metadata } from '@/types/reader';
import type { ITitle } from '@/types/library';

import { EllipsisVertical, Undo2, Book } from 'lucide-react';
import { useEffect, useRef, useState, useLayoutEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';

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

import { getTitle } from '@/services/api/library/getTitle';

import { useMarkdown } from '@/hooks/ereader/useMarkdown';

import { Button } from '@/components/ui/button';

import { Literata } from 'next/font/google';

const literata = Literata({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
});

function ReaderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<ITitle | null>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [metadata, setMetadata] = useState<Metadata[]>([]);

    const { pages } = useMarkdown(metadata);
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: pages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 1000,
        overscan: 8,
    });

    const [pageNumber, setPageNumber] = useState<number | null>(null);

    useEffect(() => {
        const container = parentRef.current;
        if (!container) return;

        function updatePageNumber() {
            if (!container) return;
            const virtualItems = virtualizer.getVirtualItems();

            if (virtualItems.length === 0) return;

            const viewportHeight = container.clientHeight;
            const scrollTop = container.scrollTop;
            const viewportCenter = scrollTop + viewportHeight / 2;

            let closestItem = virtualItems[0];
            let closestDistance = Math.abs(
                virtualItems[0].start +
                    (virtualItems[0].end - virtualItems[0].start) / 2 -
                    viewportCenter,
            );

            for (const item of virtualItems) {
                const itemCenter = item.start + (item.end - item.start) / 2;
                const distance = Math.abs(itemCenter - viewportCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = item;
                }
            }

            setPageNumber(closestItem.index);
        }

        updatePageNumber();

        container.addEventListener('scroll', updatePageNumber, { passive: true });
        window.addEventListener('resize', updatePageNumber);

        return () => {
            container.removeEventListener('scroll', updatePageNumber);
            window.removeEventListener('resize', updatePageNumber);
        };
    }, [virtualizer, pages.length]);

    useEffect(() => {
        async function init() {
            const titleId = searchParams.get('tid');
            const isPublic = searchParams.get('is_public');

            if (!titleId || !isPublic) return;

            const title = await getTitle(titleId, isPublic);

            if (!title) return;

            setTitle(title);

            const res = await fetch(title.parsed_pdf_presigned_url);

            const doc: Document = await res.json();

            setAssets(doc.assets || []);
            setMetadata(doc.metadata);
        }
        init().then(() => setIsLoading(false));
    }, [searchParams]);

    function getAssetSrc(src?: string) {
        const m = new Map<string, string>();
        for (const a of assets) m.set(a.name, `data:${a.mime};base64,${a.data}`);
        if (!src) return '';
        if (m.has(src)) return m.get(src)!;
        const base = src.split('/').pop() || src;
        if (m.has(base)) return m.get(base)!;
        return src;
    }

    if (isLoading)
        return (
            <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-neutral-400'>
                <Book className='mb-4 h-12 w-12 animate-pulse' />
                <span className='animate-pulse text-xl font-medium'>
                    Loading your book. Just a moment...
                </span>
            </div>
        );

    if (!title || !metadata.length) return <div>No document</div>;

    return (
        <div className='relative flex h-screen w-screen flex-col overflow-hidden dark:bg-black'>
            <nav className='flex h-16 w-full items-center justify-between border-b border-neutral-500 bg-neutral-950 px-4'>
                <Button onClick={() => router.push('/library')} variant='ghost'>
                    <Undo2 />
                    Return
                </Button>

                <h1 className='uppercase'>{title.title}</h1>

                <Button variant='ghost'>
                    {/* TODO */}
                    <EllipsisVertical />
                </Button>
            </nav>

            <main className='relative flex min-h-0 w-full flex-1 justify-center overflow-hidden'>
                <div
                    ref={parentRef}
                    className={`h-full ${literata.className} scrollbar-thin scrollbar-zinc-900 lg:scrollbar-w-8 w-full overflow-x-hidden overflow-y-auto px-8 md:px-32 lg:px-48 xl:px-96 2xl:px-[33svw]`}
                >
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {virtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={virtualizer.measureElement}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[
                                        rehypeRaw,
                                        rehypeKatex,
                                        rehypeSlug,
                                        rehypeAutolinkHeadings,
                                        [rehypeHighlight, { ignoreMissing: true }],
                                    ]}
                                    components={{
                                        h1: ({ children }) => (
                                            <h1 className='mb-2 break-inside-avoid text-2xl font-semibold text-neutral-300'>
                                                {children}
                                            </h1>
                                        ),
                                        p: ({ children }) => (
                                            <div className='my-2 text-lg text-neutral-400'>
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
                                        tr: ({ children }) => (
                                            <tr className='break-inside-avoid border-b border-gray-200 dark:border-neutral-800'>
                                                {children}
                                            </tr>
                                        ),
                                        th: ({ children }) => (
                                            <th className='break-inside-avoid px-2 py-1 text-left font-semibold'>
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className='break-inside-avoid px-2 py-1 align-top'>
                                                {children}
                                            </td>
                                        ),
                                        img: ({ src, title }) => (
                                            <span className='break-inside-avoid'>
                                                <Figure
                                                    src={getAssetSrc(src as string)}
                                                    caption={title as string}
                                                />
                                            </span>
                                        ),
                                        code: (props: any) => {
                                            const { inline, className, children, ...rest } =
                                                props;

                                            if (!inline) {
                                                const metdataPageIdx = Number(children);

                                                return (
                                                    <span
                                                        data-page-index={`${metdataPageIdx}`}
                                                        style={{
                                                            display: 'inline-block',
                                                            height: '1px',
                                                            opacity: 0,
                                                        }}
                                                    >
                                                        {metdataPageIdx}
                                                    </span>
                                                );
                                            }

                                            if (inline)
                                                return (
                                                    <code className='break-inside-avoid rounded bg-neutral-800 px-1 py-0.5'>
                                                        {children}
                                                    </code>
                                                );

                                            return (
                                                <pre className='my-4 break-inside-avoid overflow-x-auto rounded-md bg-neutral-900 p-3 text-xs break-words whitespace-pre-wrap'>
                                                    <code className={className} {...rest}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            );
                                        },
                                    }}
                                >
                                    {pages[virtualItem.index]}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className='flex w-full flex-col items-center justify-center gap-4 px-32 pt-8 pb-4 text-center text-xs font-medium text-neutral-400'>
                <p>
                    Page {(pageNumber ?? 0) + 1} of {pages.length} •{' '}
                    {pages.length > 0
                        ? `${Math.round((((pageNumber ?? 0) + 1) / pages.length) * 100)}%`
                        : '0%'}
                </p>
            </footer>
        </div>
    );
}

function Figure({ src, caption }: { src: string; caption?: string }) {
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const captionRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        if (!wrapperRef.current || !captionRef.current) return;

        const set = () => {
            wrapperRef.current!.style.paddingBottom = `${captionRef.current!.offsetHeight}px`;
        };
        set();

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(set);
            ro.observe(captionRef.current);
            return () => ro.disconnect();
        }
    }, [caption]);

    return (
        <span ref={wrapperRef} className='relative inline-block max-w-full'>
            <img src={src} alt='' className='h-auto max-w-full' />
            {caption && (
                <span ref={captionRef} className='absolute left-0 w-full text-sm'>
                    {caption}
                </span>
            )}
        </span>
    );
}

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-neutral-400'>
                    <Book className='mb-4 h-12 w-12 animate-pulse' />
                    <span className='animate-pulse text-xl font-medium'>
                        Loading your book. Just a moment...
                    </span>
                </div>
            }
        >
            <ReaderContent />
        </Suspense>
    );
}
