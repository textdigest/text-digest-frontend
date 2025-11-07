'use client';
import type { BBox, Document, Asset, Metadata } from '@/types/reader';
import type { ITitle } from '@/types/library';

import { EllipsisVertical, Undo2, Book, CaseSensitive, Notebook, Search } from 'lucide-react';
import { useEffect, useRef, useState, useLayoutEffect, Suspense, useCallback } from 'react';
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
import { getNotes } from '@/services/api/library/getNotes';

import { useMarkdown } from '@/hooks/reader/useMarkdown';
import { useReaderSettings, ReaderSettingsProvider } from '@/hooks/reader/useReaderSettings';
import { QnAProvider } from '@/hooks/reader/useQnA';
import { AnnotateProvider, useAnnotate } from '@/hooks/reader/useAnnotate';

import { Button } from '@/components/ui/button';
import { FontSettings } from '@/components/custom/reader/FontSettings';
import { TextSelectionMenu } from '@/components/custom/reader/TextSelectionMenu';
import { QnA } from '@/components/custom/reader/QnA';
import { Annotate } from '@/components/custom/reader/Annotate';

function ReaderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<ITitle | null>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [metadata, setMetadata] = useState<Metadata[]>([]);
    const [notes, setNotes] = useState<
        Array<{
            text?: string; // New format: highlighted text
            annotation?: string; // New format: annotation comment
            comment?: string; // Old format: backward compatibility
            page_num: number;
            book_title: string;
        }>
    >([]);

    const { pages } = useMarkdown(metadata);
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: pages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 1000,
        overscan: 8,
    });

    const [pageNumber, setPageNumber] = useState<number | null>(null);

    const [fontMenuOpen, setFontMenuOpen] = useState(false);

    const { fontClass, fontSize, pageColor } = useReaderSettings();
    const { setBookContext, setRefreshNotes } = useAnnotate();

    // Function to refresh notes from the API
    const refreshNotes = useCallback(async () => {
        if (!title) return;
        try {
            const notesData = await getNotes({ bookTitle: title.title });
            setNotes(notesData.notes || []);
        } catch (error) {
            console.error('Failed to refresh notes:', error);
        }
    }, [title]);

    // Set the refresh function in the annotate context
    useEffect(() => {
        setRefreshNotes(refreshNotes);
    }, [refreshNotes, setRefreshNotes]);

    // Set book context when title is available (use pageNumber 0 as default if not calculated yet)
    useEffect(() => {
        if (title) {
            setBookContext(title.title, pageNumber !== null ? pageNumber : 0);
        }
    }, [title, pageNumber, setBookContext]);

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
            if (!title || !title.parsed_pdf_presigned_url) return;

            const res = await fetch(title.parsed_pdf_presigned_url);
            const doc: Document = await res.json();

            setTitle(title);
            setAssets(doc.assets || []);
            setMetadata(doc.metadata);

            // Fetch notes for this book
            try {
                const notesData = await getNotes({ bookTitle: title.title });
                setNotes(notesData.notes || []);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
                // If notes don't exist yet, that's okay - just set empty array
                setNotes([]);
            }
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

    // Get notes for a specific page (pageNumber is 0-indexed, notes.page_num is 1-indexed)
    function getNotesForPage(pageIndex: number) {
        return notes.filter((note) => note.page_num === pageIndex + 1);
    }

    // Highlight text in markdown content
    function highlightAnnotatedText(content: string, pageIndex: number) {
        const pageNotes = getNotesForPage(pageIndex);
        if (pageNotes.length === 0) return content;

        let highlightedContent = content;
        const processedRanges: Array<{ start: number; end: number }> = [];

        // Sort notes by text length (longer first) to avoid partial matches
        const sortedNotes = [...pageNotes].sort((a, b) => {
            const textA = (a.text || a.comment || '').length;
            const textB = (b.text || b.comment || '').length;
            return textB - textA;
        });

        // For each note, highlight the original selected text
        sortedNotes.forEach((note) => {
            // Use new format (text) or fall back to old format (comment) for backward compatibility
            const textToHighlight = note.text || note.comment;
            if (!textToHighlight || textToHighlight.trim().length === 0) return;

            // Trim and escape special regex characters
            const trimmedText = textToHighlight.trim();
            const escapedText = trimmedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Create a regex to find the text (case-insensitive)
            // Use word boundaries to avoid partial matches, but make them optional
            const regex = new RegExp(`(${escapedText})`, 'gi');
            const matches = Array.from(highlightedContent.matchAll(regex));

            // Process matches in reverse order to maintain correct indices
            for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i];
                if (match.index === undefined) continue;

                const start = match.index;
                const end = start + match[0].length;

                // Check if this range overlaps with already processed ranges
                const overlaps = processedRanges.some(
                    (range) => !(end <= range.start || start >= range.end),
                );

                if (!overlaps) {
                    // Check if we're already inside a mark tag by looking at surrounding context
                    const before = highlightedContent.substring(Math.max(0, start - 10), start);
                    const after = highlightedContent.substring(end, Math.min(highlightedContent.length, end + 10));
                    
                    // Only highlight if not already inside a mark tag
                    if (!before.includes('<mark') && !after.includes('</mark>')) {
                        // Insert highlight markup
                        const beforeText = highlightedContent.substring(0, start);
                        const matchText = highlightedContent.substring(start, end);
                        const afterText = highlightedContent.substring(end);

                        highlightedContent =
                            beforeText +
                            `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${matchText}</mark>` +
                            afterText;

                        processedRanges.push({ start, end });
                    }
                }
            }
        });

        return highlightedContent;
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
        <div
            className='relative flex h-[100svh] w-[100svw] flex-col overflow-hidden'
            style={{ backgroundColor: pageColor.bgColor }}
        >
            <nav className='z-50 flex h-16 w-full items-center justify-between border-b border-neutral-500 bg-neutral-950 px-4'>
                <Button onClick={() => router.push('/library')} variant='ghost'>
                    <Undo2 />
                    Return
                </Button>

                <h1 className='uppercase'>{title.title}</h1>

                <div className='hidden items-center gap-2 lg:flex'>
                    <Button variant='ghost' className='mx-2'>
                        <Search />
                    </Button>
                    <Button
                        variant='ghost'
                        className='mx-2'
                        onClick={() => setFontMenuOpen(!fontMenuOpen)}
                    >
                        <CaseSensitive />
                    </Button>
                    <Button variant='ghost' className='mx-2'>
                        <Notebook />
                    </Button>
                </div>

                <Button variant='ghost' className='mx-2 lg:hidden'>
                    <EllipsisVertical />
                </Button>
            </nav>

            <main className='relative flex min-h-0 w-full flex-1 justify-center overflow-hidden'>
                <FontSettings isOpen={fontMenuOpen} onClose={() => setFontMenuOpen(false)} />
                <QnA />
                <Annotate />
                <TextSelectionMenu />

                <div
                    ref={parentRef}
                    className={`scrollbar-thin scrollbar-zinc-900 lg:scrollbar-w-8 h-full w-full overflow-x-hidden overflow-y-auto px-8 md:px-32 lg:px-48 xl:px-96 2xl:px-[33svw]`}
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
                                        rehypeKatex,
                                        rehypeRaw,
                                        rehypeSlug,
                                        rehypeAutolinkHeadings,
                                        [rehypeHighlight, { ignoreMissing: true }],
                                    ]}
                                    components={{
                                        mark: ({ children }) => (
                                            <mark className='bg-yellow-200 dark:bg-yellow-800 rounded px-0.5'>
                                                {children}
                                            </mark>
                                        ),
                                        h1: ({ children }) => (
                                            <h1
                                                className={`mb-2 break-inside-avoid text-2xl font-semibold ${fontClass}`}
                                                style={{
                                                    fontSize: `${fontSize}px`,
                                                    color: pageColor.headingColor,
                                                }}
                                            >
                                                {children}
                                            </h1>
                                        ),
                                        p: ({ children }) => (
                                            <div
                                                className={`my-2 text-lg ${fontClass}`}
                                                style={{
                                                    fontSize: `${fontSize}px`,
                                                    color: pageColor.textColor,
                                                }}
                                            >
                                                {children}
                                            </div>
                                        ),
                                        li: ({ children }) => (
                                            <div
                                                className={`my-2 text-lg ${fontClass}`}
                                                style={{
                                                    fontSize: `${fontSize}px`,
                                                    color: pageColor.textColor,
                                                }}
                                            >
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
                                    {highlightAnnotatedText(pages[virtualItem.index], virtualItem.index)}
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
    const captionRef = useRef<HTMLDivElement>(null);
    const { fontClass, pageColor } = useReaderSettings();

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
                <div
                    ref={captionRef}
                    className='absolute left-0 min-w-64 text-sm'
                    style={{
                        color: pageColor.textColor,
                    }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
                        components={{
                            p: ({ children }) => (
                                <span className={`text-sm lg:text-base ${fontClass}`}>
                                    {children}
                                </span>
                            ),
                        }}
                    >
                        {caption}
                    </ReactMarkdown>
                </div>
            )}
        </span>
    );
}

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <ReaderSettingsProvider>
            <QnAProvider>
                <AnnotateProvider>
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
                </AnnotateProvider>
            </QnAProvider>
        </ReaderSettingsProvider>
    );
}
