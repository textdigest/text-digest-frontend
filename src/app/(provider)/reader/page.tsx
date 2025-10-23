'use client';
import type { BBox, Document, Asset, Metadata } from '@/types/reader';
import type { ITitle } from '@/types/library';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
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

    const [assets, setAssets] = useState<Asset[]>([]);
    const [metadata, setMetadata] = useState<Metadata[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [pages, setPages] = useState<string[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);

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

    function toMarkdown(metadata: Metadata) {
        if (metadata.type === 'text') {
            if (metadata.text_level && metadata.text_level > 0) {
                const level = Math.min(6, metadata.text_level);
                return `${'#'.repeat(level)} ${metadata.text}`;
            }
            return metadata.text;
        }

        if (metadata.type === 'image') {
            const cap = (metadata.image_caption && metadata.image_caption.join(' ')) || '';
            const safe = cap.replace(/"/g, '\\"');
            return `![](${metadata.img_path} "${safe}")`;
        }

        if (metadata.type === 'list') {
            const ordered = /ordered|ol/i.test(metadata.sub_type);
            return metadata.list_items
                .map((t, i) => (ordered ? `${i + 1}. ${t}` : `- ${t}`))
                .join('\n');
        }
        return '';
    }

    useEffect(() => {
        if (!metadata.length) {
            setPages([]);
            return;
        }

        const max = Math.max(...metadata.map((m) => m.page_idx));

        const pages: Metadata[][] = Array.from({ length: max + 1 }, () => []);

        for (const m of metadata) pages[m.page_idx].push(m);

        const isText = (m: Metadata): m is Extract<Metadata, { type: 'text' }> =>
            m.type === 'text';

        const markdownPages = pages.map((items) => {
            const out: string[] = [];

            let i = 0;
            while (i < items.length) {
                const metadata = items[i];

                if (isText(metadata) && metadata.text_level === 1) {
                    const headerMarkdown: string[] = [metadata.text];
                    i++;

                    // Ensures multiple headers are combined.
                    while (i < items.length) {
                        const next = items[i];
                        if (!(isText(next) && next.text_level === 1)) break;
                        headerMarkdown.push(next.text);
                        i++;
                    }

                    out.push(`# ${headerMarkdown.join(' ')}`);
                    continue;
                }

                const md = toMarkdown(metadata).trim();
                if (md) out.push(md);

                i++;
            }

            return out.join('\n\n');
        });
        setPages(markdownPages);
    }, [metadata]);

    if (isLoading) return <div>Loading</div>;

    if (!title || !metadata.length) return <div>No document</div>;

    return (
        <div className='relative h-screen w-screen dark:bg-neutral-950'>
            <main className='relative flex h-full w-full justify-center'>
                <div className='prose dark:prose-invert prose-headings:font-mono prose-p:font-mono prose-th:font-mono prose-td:font-mono prose-li:font-mono h-full w-full max-w-none'>
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
                                <h1 className='mt-8 mb-4 text-2xl font-bold text-neutral-100'>
                                    {children}
                                </h1>
                            ),
                            p: ({ children }) => (
                                <div className='my-4 text-neutral-200'>{children}</div>
                            ),
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
                            img: ({ src, title }) => (
                                <Figure
                                    src={getAssetSrc(src as string)}
                                    caption={title as string}
                                />
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
                        {pages[pageNumber] || ''}
                    </ReactMarkdown>
                </div>

                <div
                    onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
                    className='absolute left-0 h-full w-[25%] bg-white/5'
                />
                <div
                    onClick={() => setPageNumber(Math.min(pages.length - 1, pageNumber + 1))}
                    className='absolute right-0 h-full w-[25%] bg-white/5'
                />
            </main>
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
                <span ref={captionRef} className='absolute left-0 w-full text-sm italic'>
                    {caption}
                </span>
            )}
        </span>
    );
}
