import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import pathToModule from '../../../util/pathToModule.js';
import 'katex/dist/katex.min.css'
import styles from './index.module.css';

const components = {
  code({node, inline, className, children, ...props}) {
    console.log(className);
    console.log(vs);
    vs['code[class*="language-"]'].fontFamily = "Menlo, \"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace";
    vs['code[class*="language-"]'].lineHeight = "20px";
    vs['pre[class*="language-"]'].border = "";
    vs['pre[class*="language-"]'].backgroundColor = "#1b1f2300";
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter language={match[1]} style={vs} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
};

function PostPage() {
  const moduleName = pathToModule(useLocation().pathname);

  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    import('../../adapter.js')
      .then(module => {
        fetch(module[moduleName])
          .then(res => res.text())
          .then(setMarkdown);
      });
  }, [moduleName]);

  return (
    <div className={styles.content}>
      <article className={styles.post}>
        <ReactMarkdown
          className="markdown-body"
          remarkPlugins={[gfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          children={markdown}
          components={components}
        />
      </article>
    </div>
  );
}

export default PostPage;