import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'bqh',
    description: 'bqh personal website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            <head>
                <link rel="shortcut icon" href="favicon.svg" type="image/svg+xml" />
            </head>
            <body className="text-gray-700">{children}</body>
        </html>
    );
}
