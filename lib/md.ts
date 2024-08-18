import markdownit from 'markdown-it';
import shiki from '@shikijs/markdown-it';

const md = markdownit({
    html: true,
});

md.use(await shiki({
    theme: 'github-light',
}));

export function markdownToHtml(markdown: string) {
    return md.render(markdown);
}
