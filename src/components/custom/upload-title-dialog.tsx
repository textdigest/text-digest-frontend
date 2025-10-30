'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

import { postTitle } from '@/services/api/library/postTitle';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function UploadTitleDialog() {
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [open, setOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [datePublished, setDatePublished] = useState<string>('');
    const [pages, setPages] = useState<number>(0);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const pdfFile = acceptedFiles[0];
                setFile(pdfFile);
                if (!title) {
                    setTitle(pdfFile.name.replace('.pdf', ''));
                }
                await extractMetadata(pdfFile);
            }
        },
    });

    async function extractMetadata(pdfFile: File) {
        setPages(0);
    }

    async function handleUpload() {
        setIsUploading(true);
        if (file) {
            await postTitle({
                title,
                file,
                author,
                datePublished,
                pages,
            });
        }
        setIsUploading(false);
    }

    function handleReset() {
        setFile(null);
        setTitle('');
        setAuthor('');
        setDatePublished('');
        setPages(0);
        setOpen(false);
        setIsUploading(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) handleReset();
            }}
        >
            <DialogTrigger asChild>
                <Button variant='default'>
                    <Upload />
                    Upload Title
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Upload Title</DialogTitle>
                    <DialogDescription>
                        Upload a new PDF to your personal library.
                    </DialogDescription>
                </DialogHeader>

                <div
                    {...getRootProps()}
                    className='transition-300 flex h-48 w-full cursor-pointer items-center justify-center rounded-sm border border-dashed border-neutral-800 bg-neutral-900 transition-colors hover:dark:bg-neutral-800'
                >
                    <input {...getInputProps()} />
                    {file ? (
                        <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                                <FileText className='text-primary h-5 w-5' />
                                <span className='text-sm font-medium'>{file.name}</span>
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center gap-2'>
                            <Upload className='h-4 w-4' />
                            <p className='text-sm'>Click to Upload or Drag n Drop</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={handleReset} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file || isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
