import markdownit from 'markdown-it';
import shiki from '@shikijs/markdown-it';
import { preWrapperPlugin } from './preWrapperPlugin';

const md = markdownit({
    html: true,
});

md.use(await shiki({ theme: 'one-light' }))
    .use(preWrapperPlugin);

export function markdownToHtml(markdown: string) {
    return md.render(markdown);
}
