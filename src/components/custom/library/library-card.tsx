'use client';
import { ITitle } from '@/types/library';
import { EllipsisVertical, Trash2, FileText } from 'lucide-react';

import { useRouter } from 'next/navigation';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';

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
            className={`flex flex-1 flex-col justify-between shadow-lg transition-transform duration-200 hover:scale-[1.03] dark:bg-neutral-900 ${title.is_processing ? 'pointer-events-none opacity-60' : ''}`}
            key={title.id}
            onClick={
                title.is_processing
                    ? undefined
                    : () => router.push(`/reader?tid=${title.id}&is_public=${title.is_public}`)
            }
            aria-disabled={title.is_processing}
        >
            <main className='flex h-full items-center justify-center overflow-hidden bg-neutral-800'>
                {title.is_processing ? (
                    <div className='flex h-32 w-32 flex-col items-center justify-center gap-2 p-2 text-center text-sm'>
                        <FileText className='animate-bounce' />
                        <p className='font-medium'>Processing</p>
                    </div>
                ) : (
                    <FileText className='h-32 w-32 text-neutral-600' />
                )}
            </main>

            <footer className='relative flex h-36 flex-col gap-1 p-2'>
                <p className='line-clamp-2 text-sm font-semibold lg:text-base dark:text-neutral-200'>
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
