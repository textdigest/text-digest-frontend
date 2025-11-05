'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Inter, Roboto_Mono, Literata } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
});

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});

const literata = Literata({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
});

type FontOption = 'inter' | 'robotoMono' | 'literata';

export const fontMap = {
    inter,
    robotoMono,
    literata,
};

export type PageColor = {
    bgColor: string;
    textColor: string;
    headingColor: string;
};

const pageColorWhite: PageColor = {
    bgColor: 'white',
    textColor: 'black',
    headingColor: '#5e5e5eff',
};

const pageColorBlack: PageColor = {
    bgColor: 'black',
    textColor: '#a3a3a3',
    headingColor: '#d4d4d4',
};

export const pageColors = [pageColorWhite, pageColorBlack];

interface ReaderSettingsContextType {
    font: FontOption;
    fontClass: string;
    fontSize: number;
    toggleFont: () => void;
    increaseFont: () => void;
    decreaseFont: () => void;
    setFontName: (fontName: FontOption) => void;
    pageColor: PageColor;
    setPageColor: (color: PageColor) => void;
}

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

interface ReaderSettingsProviderProps {
    children: ReactNode;
}

export function ReaderSettingsProvider({ children }: ReaderSettingsProviderProps) {
    const [font, setFont] = useState<FontOption>('literata');
    const [fontSize, setFontSize] = useState<number>(18);
    const [pageColor, setPageColor] = useState<PageColor>(pageColorBlack);

    const toggleFont = () => {
        const fonts: FontOption[] = ['inter', 'robotoMono', 'literata'];
        const nextIndex = (fonts.indexOf(font) + 1) % fonts.length;
        setFont(fonts[nextIndex]);
    };

    const setFontName = (fontName: FontOption) => {
        setFont(fontName);
    };

    const increaseFont = () => setFontSize((s) => Math.min(s + 2, 32));

    const decreaseFont = () => setFontSize((s) => Math.max(s - 2, 10));

    const fontClass = fontMap[font].className;

    return (
        <ReaderSettingsContext.Provider
            value={{
                font,
                fontClass,
                fontSize,
                toggleFont,
                increaseFont,
                decreaseFont,
                setFontName,
                pageColor,
                setPageColor,
            }}
        >
            {children}
        </ReaderSettingsContext.Provider>
    );
}

export function useReaderSettings() {
    const context = useContext(ReaderSettingsContext);
    if (context === undefined) {
        throw new Error('useReaderSettings must be used within a ReaderSettingsProvider');
    }
    return context;
}
