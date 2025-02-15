import { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

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
            <body className="text-gray-700">
                {children}
                <Footer />
            </body>
        </html>
    );
}
