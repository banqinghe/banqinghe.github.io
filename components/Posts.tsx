import Link from 'next/link';
import { Post } from '@/interface/post';

export default function Posts({ posts }: { posts: Post[] }) {
    const years = posts.reduce((yearMap, post) => {
        const year = post.date.slice(0, 4);
        if (yearMap.has(year)) {
            yearMap.set(year, [...yearMap.get(year)!, post]);
        } else {
            yearMap.set(year, []);
        }
        return yearMap;
    }, new Map<string, Post[]>());

    return (
        <div>
            {[...years].map(([year, posts]) => (
                <div key={year} className="mb-2">
                    <h2 className="text-2xl font-bold mb-3">{year}</h2>
                    {posts.map(({ slug, title, date }) => (
                        <Link key={slug} href={`/posts/${slug}`} className="flex justify-between hover:opacity-80">
                            <h3 className="text-lg font-medium mb-3 leading-snug">
                                {title}
                            </h3>
                            <time dateTime={date.slice(5, 10)} className="ml-3 text-md text-gray-400 whitespace-nowrap">
                                {date.slice(5, 10)}
                            </time>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}
