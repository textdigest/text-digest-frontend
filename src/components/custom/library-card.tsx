'use client';
import { ITitle } from '@/types/library';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';

const PdfDocument = dynamic(
    () =>
        import('react-pdf').then(async (mod) => {
            const pdfjs = await import('pdfjs-dist');
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
            return mod.Document;
        }),
    { ssr: false },
);

const PdfPage = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

export function LibraryCard({
    title,
    onDelete,
}: {
    title: ITitle;
    onDelete: (title: ITitle) => void;
}) {
    const router = useRouter();

    return (
        <div
            className='flex h-96 w-64 flex-col justify-between shadow-lg dark:bg-neutral-900'
            key={title.id}
            onClick={() => router.push(`/reader?tid=${title.id}&is_public=${title.is_public}`)}
        >
            <main className='flex h-full items-baseline justify-center overflow-hidden'>
                <Suspense
                    fallback={
                        <div className='flex h-full w-full items-center justify-center'>
                            <div className='h-64 w-48 animate-pulse bg-neutral-800' />
                        </div>
                    }
                >
                    <PdfDocument file={title.pdf_presigned_url}>
                        <PdfPage
                            pageNumber={1}
                            width={256}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </PdfDocument>
                </Suspense>
            </main>

            <footer className='relative flex h-36 flex-col gap-1 p-2'>
                <p className='line-clamp-2 font-semibold dark:text-neutral-200'>
                    {title.title}
                </p>
                <p className='mt-auto line-clamp-2 text-sm font-medium dark:text-neutral-400'>
                    {title.author}
                </p>
                <Menubar
                    className='absolute right-2 bottom-2 border-0 bg-transparent p-0 shadow-none'
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenubarMenu>
                        <MenubarTrigger className='cursor-pointer p-1'>
                            <EllipsisVertical size={20} />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(title);
                                }}
                            >
                                <Trash2 className='mr-2 h-4 w-4 text-red-700 dark:text-red-400' />
                                <p className='font-medium text-red-800 dark:text-red-500'>
                                    Delete
                                </p>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </footer>
        </div>
    );
}
