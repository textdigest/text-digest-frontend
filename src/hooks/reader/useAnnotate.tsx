'use client';
import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { postNote } from '@/services/api/library/postNotes';
import { toast } from 'sonner';

interface AnnotateContextType {
    highlightedText: string;
    setHighlightedText: (text: string) => void;
    //
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    //
    text: string;
    setText: (text: string) => void;
    //
    isSaving: boolean;
    //
    handleSave: () => void | Promise<void>;
    setBookContext: (bookTitle: string, pageNumber: number) => void;
    //
    reset: () => void;
    //
    setRefreshNotes: (refreshFn: () => Promise<void>) => void;
}

const AnnotateContext = createContext<AnnotateContextType | undefined>(undefined);

interface AnnotateProviderProps {
    children: ReactNode;
}

export function AnnotateProvider({ children }: AnnotateProviderProps) {
    const [highlightedText, setHighlightedText] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    
    // Book context for saving notes
    const bookTitleRef = useRef<string>('');
    const pageNumberRef = useRef<number | null>(null);
    
    // Refresh notes callback
    const refreshNotesRef = useRef<(() => Promise<void>) | null>(null);
    
    // Use refs to always get the latest values
    const textRef = useRef<string>('');
    const highlightedTextRef = useRef<string>('');
    
    // Keep refs in sync with state
    useEffect(() => {
        textRef.current = text;
    }, [text]);
    
    useEffect(() => {
        highlightedTextRef.current = highlightedText;
    }, [highlightedText]);

    function reset() {
        setHighlightedText('');
        setText('');
    }

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    function setBookContext(bookTitle: string, pageNumber: number) {
        bookTitleRef.current = bookTitle;
        pageNumberRef.current = pageNumber;
    }

    function setRefreshNotes(refreshFn: () => Promise<void>) {
        refreshNotesRef.current = refreshFn;
    }

    async function handleSave() {
        // Use refs to get the latest values (avoids closure issues)
        const currentText = textRef.current;
        const currentHighlightedText = highlightedTextRef.current;
        const currentBookTitle = bookTitleRef.current;
        const currentPageNumber = pageNumberRef.current;
        
        if (!currentText || typeof currentText !== 'string') {
            console.warn('handleSave called but text is invalid:', currentText, typeof currentText);
            return;
        }
        const trimmedText = currentText.trim();
        if (!trimmedText) {
            console.warn('handleSave called but text is empty after trimming');
            return;
        }
        if (!currentBookTitle || currentPageNumber === null) {
            console.warn('handleSave called but book context is not set');
            toast.error('Cannot save annotation: book context not available');
            return;
        }
        if (isSaving) {
            console.warn('handleSave called but already saving');
            return;
        }
        
        setIsSaving(true);
        try {
            await postNote({
                text: currentHighlightedText || '', // The highlighted/selected text
                annotation: trimmedText, // The annotation comment
                pageNum: currentPageNumber + 1, // pageNumber is 0-indexed, API expects 1-indexed
                bookTitle: currentBookTitle,
            });
            toast.success('Annotation saved successfully');
            reset();
            
            // Refresh notes to show the new highlight
            if (refreshNotesRef.current) {
                await refreshNotesRef.current();
            }
        } catch (error) {
            console.error('Failed to save annotation:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message.includes('ConditionalCheckFailedException')
                        ? 'Unable to save annotation. The book entry may not be initialized. Please try again.'
                        : error.message
                    : 'Failed to save annotation. Please try again.';
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <AnnotateContext.Provider
            value={{
                highlightedText,
                setHighlightedText,

                isOpen,
                setIsOpen,

                text,
                setText,

                isSaving,

                handleSave,
                setBookContext,

                reset,

                setRefreshNotes,
            }}
        >
            {children}
        </AnnotateContext.Provider>
    );
}

export function useAnnotate() {
    const context = useContext(AnnotateContext);
    if (context === undefined) {
        throw new Error('useAnnotate must be used within an AnnotateProvider');
    }
    return context;
}

