import markdownit from 'markdown-it';
import shiki from '@shikijs/markdown-it';
import iterator from 'markdown-it-for-inline';
import { preWrapperPlugin } from './preWrapperPlugin';
import { HOSTNAME } from './constants';

const md = markdownit({
    html: true,
});

md.use(await shiki({ theme: 'one-light' }))
    .use(iterator, 'external_link', 'link_open', (tokens: any[], idx: number) => {
        const token = tokens[idx];
        let url: URL;
        try {
            url = new URL(token.attrGet('href'));
        } catch {
            return;
        }
        if (url.hostname && url.hostname !== HOSTNAME) {
            token.attrPush(['target', '_blank']);
        }
    })
    .use(preWrapperPlugin);

export function markdownToHtml(markdown: string) {
    return md.render(markdown);
}
