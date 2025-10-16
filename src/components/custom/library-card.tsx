import { ITitle } from '@/types/library';
import { EllipsisVertical, Trash2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
                <Document file={title.pdf_presigned_url}>
                    <ReactPdfPage
                        pageNumber={1}
                        width={256}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
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
