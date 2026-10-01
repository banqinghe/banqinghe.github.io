import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getAllPosts, getPostBySlug } from '@/lib/api';
import { markdownToHtml } from '@/lib/markdown/markdown';
import Outline from './Outline';

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

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

export default async function Post({ params }: Params) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    const content = markdownToHtml(post.content || '');

    return (
        <main>
            <Outline />
            <article className="max-w-[90%] md:max-w-[680px] mx-auto pt-12 md:pt-24">
                <div className="relative mb-8">
                    <h1 className="mb-6 text-2xl md:text-4xl/snug font-bold">{post.title}</h1>
                    <time className="text-gray-400 font-mono" dateTime={post.date}>{post.date}</time>
                    <Link href="/" className="absolute right-0 bottom-0 underline hover:opacity-80">Back</Link>
                </div>
                <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
                <Footer />
            </article>
        </main>
    );
}
