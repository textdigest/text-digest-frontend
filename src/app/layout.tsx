import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Noto_Sans } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
    title: '',
    description: '',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head />
            <body className={`antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
