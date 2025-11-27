import Footer from '@/components/Footer';
import { getPostBySlug } from '@/lib/api';
import { markdownToHtml } from '@/lib/markdown/markdown';
import { PlainRender } from './examples/plain-render';
import { AddAnimation } from './examples/add-animation';
import { AdaptiveTypingSpeed } from './examples/adaptive-typing-speed';
import { IncrementalTransform } from './examples/incremental-transform';
import { AutoComplete } from './examples/auto-complete';
import { getAllHighlights } from './highlights';

import './inject.css';

export function generateMetadata() {
    const { title } = getPostBySlug('llm-typewriter');
    return { title };
}

/** 将 markdown 内容按二级标题拆分 */
function splitMarkdownBySecondLevel(markdown: string): string[] {
    const regex = /(^## .*(?:\n(?!## ).*)*)/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(markdown)) !== null) {
        matches.push(match[0].trim());
    }
    return matches;
}

export default async function LLMTypewriter() {
    const { title, date, content } = getPostBySlug('llm-typewriter');

    const components = [
        <PlainRender codes={[await getAllHighlights('plain'), await getAllHighlights('markdown')]} />,
        <AddAnimation code={await getAllHighlights('animation')} />,
        <AdaptiveTypingSpeed codes={[await getAllHighlights('fixed-speed'), await getAllHighlights('adaptive-speed')]} />,
        <IncrementalTransform code={await getAllHighlights('incremental-transform')} />,
        <AutoComplete code={await getAllHighlights('auto-complete')} />,
    ];

    const sections = splitMarkdownBySecondLevel(content)
        .map(md => markdownToHtml(md))
        .map((html, index) => (
            <section
                key={index}
                className="mb-12 md:grid md:grid-cols-[auto_1fr] md:gap-8 md:items-start"
            >
                <div
                    className="prose md:w-[65ch] pb-8 md:pb-24"
                    dangerouslySetInnerHTML={{ __html: html }}
                >
                </div>
                <div className="sticky top-4 w-full min-w-[300px] font-mono">
                    {components[index]}
                </div>
            </section>
        ));

    return (
        <main className="pt-10 max-w-[1450px] px-4 mx-auto">
            <h1 className="mb-6 text-2xl md:text-4xl/snug font-bold">{title}</h1>
            <time className="text-gray-400 font-mono" dateTime={date}>{date}</time>
            <article className="mt-8">
                {sections}
            </article>
            <Footer />
        </main>
    );
}
