import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/api';
import { markdownToHtml } from '@/lib/markdown/markdown';
import Outline from './Outline';

interface Params {
    params: {
        slug: string;
    };
}

export function generateMetadata({ params }: Params): Metadata {
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const title = `${post.title}`;

    return {
        title,
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();

    return posts.map(post => ({
        slug: post.slug,
    }));
}

export default function Post({ params }: Params) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const content = markdownToHtml(post.content || '');

    return (
        <main>
            <Outline />
            <article className="w-[640px] max-w-[90%] mx-auto pt-12 md:pt-24">
                <div className="relative mb-8">
                    <h1 className="mb-6 text-2xl md:text-4xl font-bold">{post.title}</h1>
                    <time className="text-gray-400 font-mono" dateTime={post.date}>{post.date}</time>
                    <Link href="/" className="absolute right-0 bottom-0 underline hover:opacity-80">Back</Link>
                </div>
                <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
            </article>
        </main>
    );
}
