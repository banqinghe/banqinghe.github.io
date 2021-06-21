import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import pathToModule from '../../../../util/pathToModule.js';
import 'katex/dist/katex.min.css'
import styles from './index.module.css';

function PostContent(props) {
  const { onDirChange } = props;
  const moduleName = pathToModule(useLocation().pathname);

  const [markdown, setMarkdown] = useState();
  const levelCounter = useRef(new Array(7).fill(0));

  const submitHeading = useCallback(({ level, children }) => {
    if (level === 1) {
      levelCounter.current.fill(0);
    }
    levelCounter.current[level]++;
    const id = `${level}-${Math.ceil(levelCounter.current[level] / 2)}`;
    onDirChange({id, content: children});
    return React.createElement(`h${level}`, { id }, children);
  }, [onDirChange]);

  const components = useMemo(() => ({
    code({node, inline, className, children, ...props}) {
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
    },
    h1: submitHeading,
    h2: submitHeading,
    h3: submitHeading,
    h4: submitHeading,
    h5: submitHeading,
    h6: submitHeading,
  }), [submitHeading]);

  useEffect(() => {
    import('../../../../config/adapter.js')
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

// export default PostContent;

export default React.memo(PostContent, (prevProps, nextProps) => prevProps.onDirChange === nextProps.onDirChange);
