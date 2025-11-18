'use client';
import { Metadata } from '@/types/reader';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface searchResultsType {
    text: string;
    page: number;
}

interface SearchContextType {
    isOpen: boolean;
    toggleOpen: () => void;
    setIsOpen: (open: boolean) => void;
    setMetadata: (metaData: Metadata[]) => void;
    setSearchTerm: (text: string) => void;
    searchResults: searchResultsType[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [metadata, setMetadata] = useState<Metadata[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<searchResultsType[]>([]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }

        const results: searchResultsType[] = metadata
            .filter(
                (item): item is Extract<Metadata, { type: 'text' }> =>
                    item.type === 'text' && typeof item.text === 'string',
            )
            .filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => ({
                text: item.text,
                page: item.page_idx,
            }));

        setSearchResults(results);
    }, [searchTerm, metadata]);

    return (
        <SearchContext.Provider
            value={{ isOpen, toggleOpen, setIsOpen, setMetadata, setSearchTerm, searchResults }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
