'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

export function PdfViewer({ url }: { url: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <div className='h-64 w-48 animate-pulse bg-neutral-800' />
            </div>
        );
    }

    return (
        <Document file={url}>
            <Page
                pageNumber={1}
                width={256}
                renderTextLayer={false}
                renderAnnotationLayer={false}
            />
        </Document>
    );
}
