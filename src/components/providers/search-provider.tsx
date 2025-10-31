'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    initSearch: <T>(data: T[], searchKeys: (keyof T)[]) => void;
    search: <T>() => T[];
    addItem: <T>(item: T) => void;
    updateItem: <T>(id: string, updater: (item: T) => T) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchableData, setSearchableData] = useState<any[]>([]);
    const [searchKeys, setSearchKeys] = useState<string[]>([]);

    const initSearch = <T,>(data: T[], keys: (keyof T)[]) => {
        setSearchableData(data);
        setSearchKeys(keys as string[]);
    };

    const addItem = <T,>(item: T) => {
        setSearchableData((prev) => [...prev, item]);
    };

    const updateItem = <T,>(id: string, updater: (item: T) => T) => {
        setSearchableData((prev) =>
            prev.map((item) => {
                if ((item as any).id === id) {
                    return updater(item as T);
                }
                return item;
            }),
        );
    };

    const search = <T,>(): T[] => {
        if (!searchTerm) return searchableData as T[];

        return searchableData.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
            }),
        ) as T[];
    };

    return (
        <SearchContext.Provider
            value={{ searchTerm, setSearchTerm, initSearch, search, addItem, updateItem }}
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
