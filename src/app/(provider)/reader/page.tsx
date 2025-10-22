'use client';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'katex/dist/katex.min.css';

import type { ITitle } from '@/types/library';
import { getTitle } from '@/services/api/library/getTitle';
import { useSearchParams } from 'next/navigation';

type MineruAsset = { name: string; data: string; mime: string };
type MineruDoc = { markdown: string; assets: MineruAsset[] }; //todo: add metadata

export default function Page() {
    const searchParams = useSearchParams();

    const [title, setTitle] = useState<ITitle | null>(null);
    const [md, setMd] = useState<string>('');
    const [assets, setAssets] = useState<MineruAsset[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function init() {
            const titleId = searchParams.get('tid');
            const isPublic = searchParams.get('is_public');

            if (!titleId || !isPublic) return;

            const title = await getTitle(titleId, isPublic);
            if (!title) return;

            setTitle(title);
            const r = await fetch(title.parsed_pdf_presigned_url);

            const doc: MineruDoc = await r.json();

            setMd(doc.markdown || '');
            setAssets(doc.assets || []);
            setIsLoading(false);
        }
        init();
    }, [searchParams]);

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
        <div className='h-screen w-screen dark:bg-neutral-950'>
            <header className='flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-neutral-100'>
                        {title.title}
                    </h1>
                    <p className='text-sm text-gray-600 dark:text-neutral-400'>
                        {title.author}
                    </p>
                </div>
            </header>
            <main className='flex h-full w-full justify-center py-4'>
                <div
                    className='prose dark:prose-invert prose-headings:font-mono prose-p:font-mono prose-th:font-mono prose-td:font-mono prose-li:font-mono w-full max-w-2xl px-4'
                    style={{
                        fontFamily:
                            '"Helvetica Mono", "HelveticaNeue-Mono", "Nimbus Mono PS", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[
                            rehypeRaw,
                            rehypeKatex,
                            rehypeSlug,
                            rehypeAutolinkHeadings,
                        ]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className='mt-8 mb-4 font-mono text-2xl font-bold tracking-tight'>
                                    {children}
                                </h1>
                            ),
                            p: ({ children }) => (
                                <p className='my-4 font-mono leading-7 font-medium'>
                                    {children}
                                </p>
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
                                <th className='px-3 py-2 text-left font-mono font-semibold'>
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className='px-3 py-2 align-top font-mono'>{children}</td>
                            ),
                            img: ({ src, alt }) => (
                                <img src={assetSrc(src as string)} alt={alt || ''} />
                            ),
                        }}
                    >
                        {md}
                    </ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
