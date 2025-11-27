'use client';

import { useRef } from 'react';
import { Tabs } from '@base-ui-components/react/tabs';
import CodeTab, { type CodeTabProps } from '../code-tab';
import { commonStyles } from '../code-templates';

const fixedSpeedHtml = /* html */`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Section 3: Adaptive Typing Speed - [fixed]</title>
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
        </script>
    </body>
    </html>
`;

const adaptiveSpeedHtml = /* html */`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Section 3: Adaptive Typing Speed - [adaptive]</title>
        <style>${commonStyles}</style>
        <style>
            #speed-info {
                position: absolute;
                bottom: 4px;
                right: 4px;
                font-family: monospace;
                font-size: 12px;
                background: #121212;
                color: #ffffff;
                padding: 8px;
                opacity: 0.7;
                scrollbar-width: thin;
                scrollbar-color: #888888 transparent;

                > div {
                    padding: 0 0 4px;
                }
            }
            #speed-info-bars-container {
                height: 100px;
                overflow: auto;
            }
            .speed-info-bars {
                display: flex;
                gap: 1px;
                margin-bottom: 1px;
                > span {
                    width: 8px;
                    height: 8px;
                    background: #02df6d;
                }
            }
        </style>
    </head>
    <body>
        <div id="output" class="markdown-output"></div>
        <div id="speed-info">
            <div>speed (words/frame)</div>
            <div id="speed-info-bars-container"></div>
        </div>
        <script type="module">
            import { unified } from "https://esm.sh/unified@11";
            import remarkParse from "https://esm.sh/remark-parse@11";
            import remarkRehype from "https://esm.sh/remark-rehype@11";
            import rehypeStringify from "https://esm.sh/rehype-stringify@10";
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
            const queue = [];
            let streamDone = false;
            let rafId = null;

            const speedInfo = document.getElementById('speed-info-bars-container');

            rafId = requestAnimationFrame(function loop() {
                speedInfo.scrollTop = speedInfo.scrollHeight;

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

                const bars = document.createElement('div');
                bars.className = 'speed-info-bars';
                bars.innerHTML = Array.from({ length: nextRenderCount }, () => '<span></span>').join('');
                speedInfo.appendChild(bars);

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
        </script>
    </body>
    </html>
`;

interface AdaptiveTypingSpeedProps {
    codes: Array<CodeTabProps['tabs']>;
}

export function AdaptiveTypingSpeed(props: AdaptiveTypingSpeedProps) {
    const { codes: [fixedSpeedCodes, adaptiveSpeedCodes] } = props;

    const iframe1Ref = useRef<HTMLIFrameElement>(null);
    const iframe2Ref = useRef<HTMLIFrameElement>(null);

    return (
        <Tabs.Root className="w-full">
            <Tabs.List className="border border-b-0 border-gray-50">
                <Tabs.Tab className="text-sm px-3 py-2 data-[active]:bg-gray-50" key={0} value={0}>固定速度</Tabs.Tab>
                <Tabs.Tab className="text-sm px-3 py-2 data-[active]:bg-gray-50" key={1} value={1}>自适应速度</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="" value={0}>
                <iframe ref={iframe1Ref} className="w-full h-[300px] bg-gray-50" srcDoc={fixedSpeedHtml}></iframe>
                <button
                    // refresh iframe
                    onClick={() => {
                        if (iframe1Ref.current) {
                            iframe1Ref.current.srcdoc = fixedSpeedHtml;
                        }
                    }}
                    type="button"
                    className="absolute top-1 right-1 w-8 h-8 grid place-items-center"
                >
                    🔄
                </button>
                <CodeTab tabs={fixedSpeedCodes} />
            </Tabs.Panel>
            <Tabs.Panel className="" value={1}>
                <iframe ref={iframe2Ref} className="w-full h-[300px] bg-gray-50" srcDoc={adaptiveSpeedHtml}></iframe>
                <button
                    // refresh iframe
                    onClick={() => {
                        if (iframe2Ref.current) {
                            iframe2Ref.current.srcdoc = adaptiveSpeedHtml;
                        }
                    }}
                    type="button"
                    className="absolute top-1 right-1 w-8 h-8 grid place-items-center"
                >
                    🔄
                </button>
                <CodeTab tabs={adaptiveSpeedCodes} />
            </Tabs.Panel>
        </Tabs.Root>
    );
}
