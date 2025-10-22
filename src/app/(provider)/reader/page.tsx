'use client';
import type { BBox, Document, Asset, Metadata } from '@/types/reader';
import type { ITitle } from '@/types/library';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function Page() {
    const searchParams = useSearchParams();

    const [title, setTitle] = useState<ITitle | null>(null);

    const [md, setMd] = useState<string>('');
    const [assets, setAssets] = useState<Asset[]>([]);
    const [metadata, setMetadata] = useState<Metadata[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const colsRef = useRef<HTMLDivElement>(null);

    const [cw, setCw] = useState<number>(0);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(1);
    const gap = 0;

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

            setMd(doc.markdown || '');
            setAssets(doc.assets || []);
            setMetadata(doc.metadata);
        }
        init().then(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const on = () => {
            setCw(window.visualViewport!.width);
        };
        on();
        window.addEventListener('resize', on);
        window.visualViewport?.addEventListener('resize', on as any);
        return () => {
            window.removeEventListener('resize', on);
            window.visualViewport?.removeEventListener('resize', on as any);
        };
    }, []);

    useEffect(() => {
        if (!colsRef.current) return;
        const pw = window.visualViewport?.width || window.innerWidth;
        const total = Math.max(1, Math.ceil(colsRef.current.scrollWidth / pw));
        setPages(total);
        setPage(0);
    }, [cw, md]);

    useEffect(() => {
        if (!colsRef.current) return;
        const pw = window.visualViewport!.width;
        console.log(pw, window.visualViewport?.width, window.innerWidth, cw);
        colsRef.current.scrollTo({ left: page * pw, behavior: 'auto' });
    }, [page]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                setPage((p) => Math.min(pages - 1, p + 1));
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setPage((p) => Math.max(0, p - 1));
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [pages]);

    const assetSrc = useMemo(() => {
        const m = new Map<string, string>();
        for (const a of assets) m.set(a.name, `data:${a.mime};base64,${a.data}`);
        return (src?: string) => {
            if (!src) return '';
            if (m.has(src)) return m.get(src)!;
            const base = src.split('/').pop() || src;
            if (m.has(base)) return m.get(base)!;
            return src;
        };
    }, [assets]);

    if (isLoading) return <div>Loading</div>;

    if (!title || !md) return <div>No document</div>;

    return (
        <div className='no-scrollbar relative h-screen w-screen overflow-y-hidden dark:bg-neutral-950'>
            <main className='no-scrollbar relative flex h-full w-full justify-center'>
                <div
                    ref={colsRef}
                    className='no-scrollbar prose dark:prose-invert prose-headings:font-mono prose-p:font-mono prose-th:font-mono prose-td:font-mono prose-li:font-mono h-full w-full max-w-none'
                    style={{
                        height: '100%',
                        overflow: 'auto',
                        columnWidth: cw ? `${cw}px` : undefined,
                        columnGap: `${gap}px`,
                        columnFill: 'auto',
                        hyphens: 'auto',
                        overflowWrap: 'anywhere',
                    }}
                    onWheel={(e) => e.preventDefault()}
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
                                <h1 className='mt-8 mb-4 text-2xl font-bold'>{children}</h1>
                            ),
                            p: ({ children }) => <p className='my-4'>{children}</p>,
                            table: ({ children }) => (
                                <table className='my-6 w-full border-collapse text-sm'>
                                    {children}
                                </table>
                            ),
                            thead: ({ children }) => (
                                <thead className='bg-gray-100 dark:bg-neutral-800'>
                                    {children}
                                </thead>
                            ),
                            tr: ({ children }) => (
                                <tr className='border-b border-gray-200 dark:border-neutral-800'>
                                    {children}
                                </tr>
                            ),
                            th: ({ children }) => (
                                <th className='px-2 py-1 text-left font-semibold'>
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className='px-2 py-1 align-top'>{children}</td>
                            ),
                            img: ({ src, alt }) => (
                                <img src={assetSrc(src as string)} alt={alt || ''} />
                            ),
                            code: (props: any) => {
                                const { inline, className, children, ...rest } = props;
                                if (inline)
                                    return (
                                        <code className='rounded bg-neutral-800 px-1 py-0.5'>
                                            {children}
                                        </code>
                                    );
                                return (
                                    <pre className='my-4 overflow-x-auto rounded-md bg-neutral-900 p-3 text-xs break-words whitespace-pre-wrap'>
                                        <code className={className} {...rest}>
                                            {children}
                                        </code>
                                    </pre>
                                );
                            },
                        }}
                    >
                        {md}
                    </ReactMarkdown>
                </div>
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className='absolute top-0 left-0 h-full w-8'
                    aria-label='Previous page'
                />
                <button
                    onClick={() => {
                        setPage((p) => p + 1);
                    }}
                    className='absolute top-0 right-0 h-full w-8'
                    aria-label='Next page'
                />
            </main>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
