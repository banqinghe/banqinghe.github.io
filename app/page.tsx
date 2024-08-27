import Posts from '@/components/Posts';
import { getAllPosts } from '@/lib/api';

export default function Home() {
    const allPosts = getAllPosts();

    return (
        <main className="w-[640px] max-w-[90%] mx-auto pt-12 md:pt-24">
            <h1 className="mb-8 text-3xl font-bold">Writing</h1>
            <Posts posts={allPosts} />
        </main>
    );
}
