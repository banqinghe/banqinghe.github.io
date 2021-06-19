import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import pathToModule from '../../../util/pathToModule.js';
import styles from './index.module.css';

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
          remarkPlugins={[gfm]}
          children={markdown}
        />
      </article>
    </div>
  );
}

export default PostPage;