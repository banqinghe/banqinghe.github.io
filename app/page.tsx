import Posts from '@/components/Posts';
import { getAllPosts } from '@/lib/api';

export default function Home() {
    const allPosts = getAllPosts();

    return (
        <>
            <h1 className="mb-8 text-3xl font-bold">Writing</h1>
            <Posts posts={allPosts} />
        </>
    );
}
