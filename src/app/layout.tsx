import type { Metadata } from 'next';

import { Noto_Sans } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

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
        <html lang='en'>
            <body className={`${notoSans.variable} ${notoSans.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
