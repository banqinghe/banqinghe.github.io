import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Writing',
    description: 'Ban Qinghe\'s personal website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </head>
            <body className={cn(inter.className, 'text-gray-700')}>
                {children}
                <Footer />
            </body>
        </html>
    );
}
