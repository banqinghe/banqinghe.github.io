import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '404',
};

export default function notFound() {
    return (
        <main className="w-[640px] max-w-[90%] h-[36rem] mx-auto pt-12 md:pt-24">
            <h1 className="mb-6 text-2xl md:text-4xl font-bold">404</h1>
            <Link href="/" className="underline">Back to Home</Link>
        </main>
    );
}
