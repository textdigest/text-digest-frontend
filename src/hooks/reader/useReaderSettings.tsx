'use client';
import { useState } from 'react';
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

type FontOption = 'inter' | 'robotoMono';

export const fontMap = {
    inter,
    robotoMono,
};

type PageColor = {
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

export function useReaderSettings() {
    const [font, setFont] = useState<FontOption>('inter');
    const [fontSize, setFontSize] = useState<number>(16);
    const [pageColor, setPageColor] = useState<PageColor>(pageColorBlack);

    const toggleFont = () => {
        const fonts: FontOption[] = ['inter', 'robotoMono'];
        const nextIndex = (fonts.indexOf(font) + 1) % fonts.length;
        setFont(fonts[nextIndex]);
    };

    const setFontName = (fontName: FontOption) => {
        setFont(fontName);
    };

    const increaseFont = () => setFontSize((s) => Math.min(s + 2, 32));
    const decreaseFont = () => setFontSize((s) => Math.max(s - 2, 10));

    const fontClass = fontMap[font].className;

    return {
        font,
        fontClass,
        fontSize,
        toggleFont,
        increaseFont,
        decreaseFont,
        setFontName,
        pageColor,
        setPageColor,
    };
}
