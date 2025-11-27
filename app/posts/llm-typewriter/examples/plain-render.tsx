'use client';

import { useRef } from 'react';
import { Tabs } from '@base-ui-components/react/tabs';
import CodeTab, { type CodeTabProps } from '../code-tab';
import { commonStyles } from '../code-templates';

const html = /* html */`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Section 1: Plain Render</title>
        <style>${commonStyles}</style>
    </head>
    <body>
        <div id="output" class="plain-output"></div>
        <script type="module">
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

            const output = document.getElementById('output');
            for await (const chunk of fetchLLM()) {
                output.textContent += chunk;
            }
        </script>
    </body>
    </html>
`;

const markdownHtml = /* html */`
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

            let md = '';

            const output = document.getElementById('output');
            for await (const chunk of fetchLLM()) {
                md += chunk;
                const html = await mdToHTML(md);
                output.innerHTML = html;
            }
        </script>
    </body>
    </html>
`;

interface PlainRenderProps {
    codes: Array<CodeTabProps['tabs']>;
}

export function PlainRender(props: PlainRenderProps) {
    const { codes: [plainCodes, markdownCodes] } = props;

    const iframe1Ref = useRef<HTMLIFrameElement>(null);
    const iframe2Ref = useRef<HTMLIFrameElement>(null);

    return (
        <Tabs.Root className="w-full">
            <Tabs.List className="border border-b-0 border-gray-50">
                <Tabs.Tab className="text-sm px-3 py-2 data-[active]:bg-gray-50" key={0} value={0}>Plain Text</Tabs.Tab>
                <Tabs.Tab className="text-sm px-3 py-2 data-[active]:bg-gray-50" key={1} value={1}>Markdown</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="" value={0}>
                <iframe ref={iframe1Ref} className="w-full h-[300px] bg-gray-50" srcDoc={html}></iframe>
                <button
                    // refresh iframe
                    onClick={() => {
                        if (iframe1Ref.current) {
                            iframe1Ref.current.srcdoc = html;
                        }
                    }}
                    type="button"
                    className="absolute top-1 right-1 w-8 h-8 grid place-items-center"
                >
                    🔄
                </button>
                <CodeTab tabs={plainCodes} />
            </Tabs.Panel>
            <Tabs.Panel className="" value={1}>
                <iframe ref={iframe2Ref} className="w-full h-[300px] bg-gray-50" srcDoc={markdownHtml}></iframe>
                <button
                    // refresh iframe
                    onClick={() => {
                        if (iframe2Ref.current) {
                            iframe2Ref.current.srcdoc = markdownHtml;
                        }
                    }}
                    type="button"
                    className="absolute top-1 right-1 w-8 h-8 grid place-items-center"
                >
                    🔄
                </button>
                <CodeTab tabs={markdownCodes} />
            </Tabs.Panel>
        </Tabs.Root>
    );
}
