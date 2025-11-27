'use client';

import { useRef } from 'react';
import CodeTab, { type CodeTabProps } from '../code-tab';
import { commonStyles } from '../code-templates';

const html = /* html */`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Section 5: Auto Complete</title>
        <style>
            ${commonStyles}
        </style>
    </head>
    <body>
        <div id="output" class="markdown-output"></div>
        <script type="module">
            import { unified } from "https://esm.sh/unified@11";
            import remarkParse from "https://esm.sh/remark-parse@11";
            import remarkRehype from "https://esm.sh/remark-rehype@11";
            import rehypeStringify from "https://esm.sh/rehype-stringify@10";
            import { marked } from 'https://esm.sh/marked@17';
            import morphdom from "https://esm.sh/morphdom@2.7.7";

            async function* fetchLLM() {
                const responses = [
                    '# 旅行准备清单\\n\\n',
                    '**在开始一次长途旅行之前，确保你已经准备好了所',
                    '有必需的物品和文件，这样可以让你的旅途更加顺利和愉快。**\\n\\n旅行前需要准备的事项：\\n\\n',
                    '- 检查护照和签证是否有效\\n',
                    '- 准备充足的现金和信用卡\\n- 打包适合当地气候的衣物\\n- 预订住宿和交通工具\\n- 购买旅行保险\\n- 准备常用药品和个人护理用品\\n\\n提前做好这些准备，可以有效避免旅途中的各种突发状况。',
                ];
                for (const chunk of responses) {
                    yield new Promise(resolve => setTimeout(() => resolve(chunk), 500));
                }
            }

            async function mdToHTML(markdown) {
                const file = await unified()
                    .use(remarkParse) // markdown -> md AST
                    .use(remarkRehype) // md AST -> html AST
                    .use(rehypeStringify) // html AST -> html string
                    .process(markdown);
                return String(file);
            }

            function render(container, html) {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                morphdom(container, temp, {
                    // 保留 container 本身，不替换
                    childrenOnly: true
                });
            }

            let md = '';
            let display = '';
            let streamDone = false;
            let rafId = null;

            const queue = [];

            const htmlBlocks = [];
            let prevTokens = [];

            function handleIncompleteMarkdown(md) {
                if (/(\\*\\*)([^*]*?)$/.test(md)) {
                    const asteriskPairs = (md.match(/\\*\\*/g) || []).length;
                    // 如果匹配到的 \`**\` 为奇数个, 进行补全
                    if (asteriskPairs % 2 === 1) {
                        md += '**';
                    }
                }
                return md;
            }

            async function diffRender(md) {
                const tokens = marked.lexer(md).filter(t => t.type !== 'space');
                const updatedIndices = [];

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];
                    const prevToken = prevTokens[i];

                    if (prevToken && prevToken.raw === token.raw) {
                        continue;
                    }

                    const safeRaw = handleIncompleteMarkdown(token.raw);
                    const htmlBlock = await mdToHTML(safeRaw);
                    const wrapped = '<div class="md-block" data-block-index="' + i + '">' + htmlBlock + '</div>';

                    if (prevToken) {
                        htmlBlocks[i] = wrapped;
                    } else {
                        htmlBlocks.push(wrapped);
                    }
                    updatedIndices.push(i);
                }

                render(output, htmlBlocks.join(''));

                if (updatedIndices.length > 0) {
                    requestAnimationFrame(() => {
                        for (const idx of updatedIndices) {
                            const el = output.querySelector('.md-block[data-block-index="' + idx + '"]');
                            if (!el) continue;
                            el.classList.add('md-block-highlight');
                            setTimeout(() => {
                                el.classList.remove('md-block-highlight');
                            }, 500);
                        }
                    });
                }

                prevTokens = tokens;
            }

            rafId = requestAnimationFrame(function loop() {
                if (queue.length === 0) {
                    if (streamDone) {
                        // 流结束且队列空, 停止轮询
                        cancelAnimationFrame(rafId);
                    } else {
                        // 流尚未结束, 队列为空, 继续等待新数据
                        rafId = requestAnimationFrame(loop);
                    }
                    return;
                }

                // 渲染长度为 queue 长度的 1/5，至少 1 个
                const nextRenderCount = Math.max(1, Math.floor(queue.length / 5));
                const nextRenderSegments = queue.splice(0, nextRenderCount);
                display += nextRenderSegments.join('');

                diffRender(display);

                rafId = requestAnimationFrame(loop);
            });

            const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'word' });

            const output = document.getElementById('output');
            for await (const chunk of fetchLLM()) {
                const segments = segmenter.segment(chunk);
                queue.push(...Array.from(segments).map(s => s.segment));
            }
            streamDone = true;
        </script>
    </body>
    </html>
`;

interface AutoCompleteProps {
    code: CodeTabProps['tabs'];
}

export function AutoComplete(props: AutoCompleteProps) {
    const { code } = props;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <>
            <iframe ref={iframeRef} className="w-full h-[300px] bg-gray-50" srcDoc={html}></iframe>
            <button
                // refresh iframe
                onClick={() => {
                    if (iframeRef.current) {
                        iframeRef.current.srcdoc = html;
                    }
                }}
                type="button"
                className="absolute top-1 right-1 w-8 h-8 grid place-items-center"
            >
                🔄
            </button>
            <CodeTab tabs={code} />
        </>
    );
}
