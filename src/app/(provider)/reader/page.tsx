'use client';
import type { BBox, Document, Asset, Metadata } from '@/types/reader';
import type { ITitle } from '@/types/library';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useViewport } from '@/hooks/useViewport';
import { usePageNumber } from '@/hooks/ereader/usePageNumber';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { Literata } from 'next/font/google';
import { EllipsisVertical, Undo2 } from 'lucide-react';

const literata = Literata({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
});

export default function Page() {
    const ref = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const viewport = useViewport();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<ITitle | null>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [metadata, setMetadata] = useState<Metadata[]>([]);
    const { pages } = useMarkdown(metadata);

    const [iterator, setIterator] = useState<number>(0);

    const p1 = pages[iterator - 1] || '';
    const curr = pages[iterator] || '';
    const n1 = pages[iterator + 1] || '';
    const merged = [p1, curr, n1].join('\n');

    const pageNumber = usePageNumber(ref, [merged]);

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
    }, []);

    function getAssetSrc(src?: string) {
        const m = new Map<string, string>();
        for (const a of assets) m.set(a.name, `data:${a.mime};base64,${a.data}`);
        if (!src) return '';
        if (m.has(src)) return m.get(src)!;
        const base = src.split('/').pop() || src;
        if (m.has(base)) return m.get(base)!;
        return src;
    }

    if (isLoading) return <div>Loading</div>;

    if (!title || !metadata.length) return <div>No document</div>;

    const gap = viewport.w >= 1280 ? 128 : 128;

    return (
        <div className='scrollbar-none relative h-screen w-screen overflow-hidden dark:bg-black'>
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

            <main className='relative flex h-full w-full justify-center'>
                <div className='h-full w-full'>
                    <div
                        className={`${literata.className} pt-4 pb-36 break-words lg:pt-8`}
                        style={{
                            height: viewport.h,
                            width: viewport.w,
                            columnWidth: viewport.w,
                            columnGap: gap,
                            columns: viewport.w >= 1280 ? 2 : 1,
                            columnFill: 'auto' as any,
                            paddingLeft: gap / 2,
                            paddingRight: gap / 2,
                        }}
                        ref={ref}
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
                                    const { inline, className, children, ...rest } = props;

                                    if (!inline) {
                                        const metdataPageIdx = Number(children);

                                        return (
                                            <span
                                                data-page-index={`${metdataPageIdx}`}
                                                style={{
                                                    display: 'block',
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
                            {merged}
                        </ReactMarkdown>
                    </div>
                </div>

                <div
                    onClick={() => setIterator(Math.max(0, iterator - 1))}
                    className='absolute left-0 h-full w-[33%] bg-neutral-800/0'
                />

                <div
                    onClick={() => setIterator(Math.min(pages.length - 1, iterator + 1))}
                    className='absolute right-0 h-full w-[33%] bg-neutral-800/0'
                />
            </main>

            <footer className='absolute bottom-4 flex w-full flex-col items-center justify-center gap-4 px-32 text-center text-xs font-medium text-neutral-400'>
                <Slider
                    min={0}
                    max={pages.length - 1}
                    step={1}
                    value={[iterator]}
                    onValueChange={([v]) => setIterator(v)}
                    className='w-full lg:max-w-1/2'
                />

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
