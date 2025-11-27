import markdownit from 'markdown-it';
import shiki from '@shikijs/markdown-it';
import iterator from 'markdown-it-for-inline';
import mathjax3 from 'markdown-it-mathjax3';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';
import markdownItCjkFriendly from 'markdown-it-cjk-friendly';
import { preWrapperPlugin } from './preWrapperPlugin';
import { HOSTNAME } from '../constants';

const md = markdownit({
    html: true,
});

md.use(await shiki({ theme: 'one-light' }))
    .use(markdownItCjkFriendly)
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
    .use(preWrapperPlugin)
    .use(mathjax3)
    .use(anchor, {
        slugify: s => s.replace(/\s+/g, '-'),
        permalink: anchor.permalink.linkInsideHeader({
            symbol: '&ZeroWidthSpace;',
            renderAttrs: (slug, state) => {
                // Find `heading_open` with the id identical to slug
                const idx = state.tokens.findIndex(token => {
                    const attrs = token.attrs;
                    const id = attrs?.find(attr => attr[0] === 'id');
                    return id && slug === id[1];
                });
                // Get the actual heading content
                const title = state.tokens[idx + 1].content;
                return {
                    'aria-label': `Permalink to "${title}"`,
                };
            },
        }),
    })
    .use(container, 'any', {
        validate: (params: string) => {
            return !!params.trim();
        },
        render: (tokens: any[], idx: number) => {
            const className = tokens[idx].info.trim();
            if (tokens[idx].nesting === 1) {
                return `<div class="${className}">\n`;
            } else {
                return '</div>\n';
            }
        },
    });

export function markdownToHtml(markdown: string) {
    return md.render(markdown);
}
