import { codeToHtml } from 'shiki';

function removeCommonIndent(code: string) {
    // 按行分割
    const lines = code.split('\n');

    // 去掉首尾空行
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

    // 找到所有非空行的最小前导空白（空格或tab）
    let minIndent: number | null = null;
    for (const line of lines) {
        if (line.trim() === '') continue;
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        if (minIndent === null || indent < minIndent) {
            minIndent = indent;
        }
    }
    if (minIndent === null) {
        minIndent = 0;
    }

    // 去除每行的公共缩进
    const result = lines.map(line => line.slice(minIndent));
    return result.join('\n');
}

async function h(code: string) {
    return codeToHtml(
        removeCommonIndent(code),
        {
            lang: 'javascript',
            themes: {
                light: 'one-light',
            },
            defaultColor: false,
        },
    );
}

let fetchLLMTab: { label: string; code: string } | null = null;

export async function getAllHighlights(key: string) {
    if (!fetchLLMTab) {
        fetchLLMTab = {
            label: 'fetch-llm.js',
            code: await h(/* js */`
                export async function* fetchLLM() {
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
            `),
        };
    }

    switch (key) {
        case 'plain':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        import { fetchLLM } from './fetch-llm.js';

                        const output = document.getElementById('output');
                        for await (const chunk of fetchLLM()) {
                            output.textContent += chunk;
                        }
                    `),
                },
                fetchLLMTab,
            ];
        case 'markdown':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        import { unified } from "https://esm.sh/unified@11";
                        import remarkParse from "https://esm.sh/remark-parse@11";
                        import remarkRehype from "https://esm.sh/remark-rehype@11";
                        import rehypeStringify from "https://esm.sh/rehype-stringify@10";
                        import { fetchLLM } from './fetch-llm.js';

                        async function mdToHTML(markdown) {
                            const file = await unified()
                                .use(remarkParse) // markdown -> md AST
                                .use(remarkRehype) // md AST -> html AST
                                .use(rehypeStringify) // html AST -> html string
                                .process(markdown);
                            return String(file);
                        }

                        let md = '';

                        const output = document.getElementById('output');
                        for await (const chunk of fetchLLM()) {
                            md += chunk;
                            const html = await mdToHTML(md);
                            output.innerHTML = html;
                        }
                    `),
                },
                fetchLLMTab,
            ];
        case 'animation':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        import { unified } from "https://esm.sh/unified@11";
                        import remarkParse from "https://esm.sh/remark-parse@11";
                        import remarkRehype from "https://esm.sh/remark-rehype@11";
                        import rehypeStringify from "https://esm.sh/rehype-stringify@10";
                        import { fetchLLM } from './fetch-llm.js';
                        import { rehypeStreamAnimated } from './plugin.js';
                        import { render } from './render.js';

                        async function mdToHTML(markdown) {
                            const file = await unified()
                                .use(remarkParse) // markdown -> md AST
                                .use(remarkRehype) // md AST -> html AST
                                .use(rehypeStreamAnimated) // html AST -> html AST with animation
                                .use(rehypeStringify) // html AST -> html string
                                .process(markdown);
                            return String(file);
                        }

                        let md = '';

                        const output = document.getElementById('output');
                        for await (const chunk of fetchLLM()) {
                            md += chunk;
                            const html = await mdToHTML(md);
                            render(output, html);
                        }
                    `),
                },
                {
                    label: 'render.js',
                    code: await h(/* js */`
                        import morphdom from "https://esm.sh/morphdom@2.7.7";

                        function render(container, html) {
                            const temp = document.createElement('div');
                            temp.innerHTML = html;
                            morphdom(container, temp, {
                                // 保留 container 本身，不替换
                                childrenOnly: true
                            });
                        }
                    `),
                },
                {
                    label: 'plugin.js',
                    code: await h(/* js */`
                        import { visit } from "https://esm.sh/unist-util-visit@5";

                        export function rehypeStreamAnimated() {
                            return (tree) => {
                                visit(tree, 'element', (node) => {
                                    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'strong'].includes(node.tagName) && node.children) {
                                        node.children = processChildren(node.children);
                                    }
                                });
                            };
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
                                            // 空白符无需处理
                                            newChildren.push({ type: 'text', value: word });
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
                                        newChildren.push({ ...child, children: processChildren(child.children) });
                                    }
                                } else {
                                    newChildren.push(child);
                                }
                            }
                            return newChildren;
                        }
                    `),
                },
                fetchLLMTab,
            ];
        case 'fixed-speed':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        let md = '';
                        let display = '';

                        setInterval(async () => {
                            if (display.length < md.length) {
                                display += md[display.length];
                                const html = await mdToHTML(display);
                                render(output, html);
                            }
                        }, 40);

                        const output = document.getElementById('output');
                        for await (const chunk of fetchLLM()) {
                            for (const char of chunk) {
                                md += char;
                            }
                        }

                    `),
                },
                fetchLLMTab,
            ];
        case 'adaptive-speed':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        let md = '';
                        let display = '';
                        const queue = [];
                        let streamDone = false;
                        let rafId = null;

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

                            mdToHTML(display).then(html => render(output, html));

                            rafId = requestAnimationFrame(loop);
                        });

                        const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'word' });

                        const output = document.getElementById('output');
                        for await (const chunk of fetchLLM()) {
                            const segments = segmenter.segment(chunk);
                            queue.push(...Array.from(segments).map(s => s.segment));
                        }
                        streamDone = true;
                    `),
                },
                fetchLLMTab,
            ];
        case 'incremental-transform':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        let md = '';
                        let display = '';
                        let streamDone = false;
                        let rafId = null;

                        const queue = [];

                        const htmlBlocks = [];
                        let prevTokens = [];

                        async function diffRender(md) {
                            const tokens = marked.lexer(md);
                            for (let i = 0; i < tokens.length; i++) {
                                const token = tokens[i];
                                const prevToken = prevTokens[i];

                                // 如果块的 raw 内容未变，则跳过渲染
                                if (prevToken && prevToken.raw === token.raw) {
                                    continue;
                                }

                                const htmlBlock = await mdToHTML(token.raw);
                                if (prevToken) {
                                    // 块内容变更，重新渲染该块
                                    htmlBlocks[i] = htmlBlock;
                                } else {
                                    // 新增块，渲染该块并追加
                                    htmlBlocks.push(htmlBlock);
                                }
                                render(output, htmlBlocks.join(''));
                            }

                            prevTokens = tokens;
                        }

                        rafId = requestAnimationFrame(function loop() {
                            if (queue.length === 0) {
                                if (streamDone) {
                                    cancelAnimationFrame(rafId);
                                } else {
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
                    `),
                },
                fetchLLMTab,
            ];
        case 'auto-complete':
            return [
                {
                    label: 'main.js',
                    code: await h(/* js */`
                        // 补全未闭合语法, 只处理了加粗
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
                            // ...
                            const safeRaw = handleIncompleteMarkdown(token.raw);
                            const htmlBlock = await mdToHTML(safeRaw);
                            // ...
                        }
                    `),
                },
                fetchLLMTab,
            ];
        default:
            return [];
    }
}
