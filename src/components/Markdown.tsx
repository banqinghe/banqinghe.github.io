import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import cn from 'classnames';

interface MarkdownProps {
  className?: string;
  text: string;
}

const Markdown = React.memo(function (props: MarkdownProps) {
  const { className, text } = props;

  return (
    <ReactMarkdown
      className={cn(className, 'markdown-body')}
      remarkPlugins={[gfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
    >
      {text}
    </ReactMarkdown>
  );
});

export default Markdown;
