/**
 * https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/preWrapper.ts
 */

import type MarkdownIt from 'markdown-it';

export function preWrapperPlugin(md: MarkdownIt) {
    const fence = md.renderer.rules.fence!;
    md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args;
        const token = tokens[idx];

        // remove title from info
        token.info = token.info.replace(/\[.*\]/, '');
        const lang = extractLang(token.info);

        return (
        `<div class="code-block-wrapper">`
        + `<span class="lang">${lang}</span>`
        + fence(...args)
        + '</div>'
        );
    };
}

function extractLang(info: string) {
    return info
        .trim()
        .replace(/=(\d*)/, '')
        .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
        .replace(/(-vue|{| ).*$/, '')
        .replace(/^vue-html$/, 'template')
        .replace(/^ansi$/, '');
}
