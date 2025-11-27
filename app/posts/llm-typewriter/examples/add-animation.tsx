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
        <title>Section 1: Markdown Render</title>
        <style>${commonStyles}</style>
    </head>
    <body>
        <div id="output" class="markdown-output"></div>
        <script type="module">
            import { unified } from "https://esm.sh/unified@11";
            import remarkParse from "https://esm.sh/remark-parse@11";
            import remarkRehype from "https://esm.sh/remark-rehype@11";
            import rehypeStringify from "https://esm.sh/rehype-stringify@10";
            import morphdom from "https://esm.sh/morphdom@2.7.7";
            import { visit } from "https://esm.sh/unist-util-visit@5";

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

            // 递归处理所有子节点
            function processChildren(children) {
                const newChildren = [];
                for (const child of children) {
                    // 如果是 Text Node，则按词拆分并包裹 span
                    if (child.type === 'text') {
                        const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'word' });
                        const segments = segmenter.segment(child.value);
                        for (const segment of segments) {
                            const word = segment.segment;
                            if (word.trim() === '') {
                                // 空格不处理
                                newChildren.push({
                                    type: 'text',
                                    value: word
                                });
                            } else {
                                newChildren.push({
                                    type: 'element',
                                    tagName: 'span',
                                    properties: { className: ['fade-in'] },
                                    children: [{ type: 'text', value: word }]
                                });
                            }
                        }
                    } else if (child.type === 'element' && child.children) {
                        // 如果当前元素已经是 fade-in 的 span，则不再递归处理，防止嵌套
                        if (
                            child.tagName === 'span' &&
                            child.properties &&
                            Array.isArray(child.properties.className) &&
                            child.properties.className.includes('fade-in')
                        ) {
                            newChildren.push(child);
                        } else {
                            newChildren.push({
                                ...child,
                                children: processChildren(child.children)
                            });
                        }
                    } else {
                        newChildren.push(child);
                    }
                }
                return newChildren;
            }

            function rehypeStreamAnimated() {
                return (tree) => {
                    visit(tree, 'element', (node) => {
                        if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'strong'].includes(node.tagName) && node.children) {
                            node.children = processChildren(node.children);
                        }
                    });
                };
            }

            async function mdToHTML(markdown) {
                const file = await unified()
                    .use(remarkParse) // markdown -> md AST
                    .use(remarkRehype) // md AST -> html AST
                    .use(rehypeStreamAnimated) // html AST -> html AST with animation
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

            const output = document.getElementById('output');
            for await (const chunk of fetchLLM()) {
                md += chunk;
                const html = await mdToHTML(md);
                render(output, html);
            }
        </script>
    </body>
    </html>
`;

interface AddAnimationProps {
    code: CodeTabProps['tabs'];
}

export function AddAnimation(props: AddAnimationProps) {
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
