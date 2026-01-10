'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Highlighter, NotebookPen, Sparkle, WandSparkles } from 'lucide-react';
import { useQnA } from '@/hooks/reader/useQnA';
import { useAnnotate } from '@/hooks/reader/useAnnotate';

type SelectionPosition = {
    top: number;
    left: number;
} | null;

export function TextSelectionMenu() {
    const [position, setPosition] = useState<SelectionPosition>(null);
    const [selectedText, setSelectedText] = useState<string>('');
    const menuRef = useRef<HTMLDivElement>(null);

    const {
        setHighlightedText: setQnAHighlightedText,
        setIsOpen: setQnAOpen,
        reset: resetQnA,
    } = useQnA();
    const {
        setHighlightedText: setAnnotateHighlightedText,
        setIsOpen: setAnnotateOpen,
        reset: resetAnnotate,
    } = useAnnotate();

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim() || '';

            if (!selection || selection.rangeCount === 0 || text === '') {
                setPosition(null);
                setSelectedText('');
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.width === 0 && rect.height === 0) {
                setPosition(null);
                setSelectedText('');
                return;
            }

            setSelectedText(text);
            setPosition({
                top: rect.bottom + 10,
                left: rect.left + rect.width / 2,
            });
        };

        const handleMouseUp = () => {
            setTimeout(handleSelectionChange, 0);
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (!position) return null;

    return (
        <div
            ref={menuRef}
            className='fixed z-50 flex gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-2'
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: 'translateX(-50%)',
            }}
        >
            <Button
                variant='secondary'
                className='px-2 py-1 text-lg'
                onClick={() => {
                    resetQnA();
                    setQnAHighlightedText(selectedText);
                    setQnAOpen(true);
                }}
            >
                <WandSparkles />
                Elaborate
            </Button>
            <Button
                variant='secondary'
                className='px-2 py-1 text-lg'
                onClick={() => {
                    resetAnnotate();
                    setAnnotateHighlightedText(selectedText);
                    setAnnotateOpen(true);
                }}
            >
                <NotebookPen />
                Annotate
            </Button>
        </div>
    );
}
