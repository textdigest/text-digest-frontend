import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Noto_Sans } from 'next/font/google';

import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
                    <SidebarProvider>{children}</SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
