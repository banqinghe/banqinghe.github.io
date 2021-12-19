import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Waline from '@waline/client';

import transToCamelCase from '../utils/transToCamelCase';
import { CatalogNode, getHeadingInfo } from '../utils/catalog';
import { globalContext } from '../store';

import 'katex/dist/katex.min.css';

function PostPage() {
  const { state } = useContext(globalContext);
  const { postUrls, postList } = state;

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/post\//, '');

  const [markdownText, setMarkdownText] = useState('');
  const [isNoContent, setIsNoContent] = useState(false);
  const [catalogList, setCatalogList] = useState<Array<CatalogNode>>([]);
  const [catalogCollapse, setCatalogCollapse] = useState(false);

  function handleSwitchCatalog(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
      setCatalogCollapse(preState => !preState);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSwitchCatalog);
    return () => {
      window.removeEventListener('keydown', handleSwitchCatalog);
    };
  }, []);

  useEffect(() => {
    if (isNoContent) {
      navigate('../404', { replace: true });
    }
  }, [isNoContent]);

  useEffect(() => {
    setCatalogList(getHeadingInfo(markdownText));
    const markdownBody = document.querySelector('.markdown-body');
    if (markdownBody) {
      for (let i = 1; i <= 6; i++) {
        (markdownBody as unknown as Element).querySelectorAll('h' + i).forEach((el, index) => {
          el.id = 'h' + i + '-' + (index + 1);
        });
      }
    }
  }, [markdownText]);

  // Fetch the markdown text by pathname, url is defined at adapter.ts.
  // If response is not a markdown file, navigate to 404 page.
  useEffect(() => {
    // const mdUrl = (urls as { [key: string]: string })[transToCamelCase(pathname)];
    const mdUrl = postUrls[transToCamelCase(pathname)];
    fetch(mdUrl)
      .then(res => {
        // Vite converts files smaller than 4kb to base64 by default, so the
        // url of markdown file may be a base64 string that start with 'data:text'
        // or the filename that end with '.md'. 
        if (!(/^data:text/.test(res.url) || /\.md$/.test(res.url))) {
          throw new Error(`Wrong path: '${location.pathname}'. Redirect to 404 page.`);
        }
        return res.text();
      })
      .then(text => {
        setMarkdownText(text);
      })
      .catch(err => {
        setIsNoContent(true);
        console.error(err);
      });

    Waline({
      el: '#comments',
      serverURL: 'https://blog-api-ers1r7f2f-banqinghe.vercel.app/',
      path: pathname,
    });

    document.title = postList.find(post => post.filename === pathname)?.title ?? pathname;
  }, [pathname]);

  function scrollToTarget(id: string) {
    (document.getElementById(id) as Element).scrollIntoView();
  }

  return (
    <div className="w-10/12 md:w-9/12 xl:w-6/12 mx-auto">

      {/* Catalog */}
      <div
        className="hidden xl:block fixed top-20 left-5 pr-3 pb-3 bg-white bg-opacity-90 rounded-md overflow-auto transition-transform duration-200"
        style={{
          maxHeight: 'calc(100vh - 160px)',
          maxWidth: 300,
          transform: `translateX(${catalogCollapse ? -300 : 0}px)`,
        }}
      >
        <h2 className="mb-4 pb-1 text-gray-400 border-b">CATALOG</h2>
        <ul>
          {catalogList.map((item, index) => (
            <li
              className="mb-2.5 last:mb-0 text-sm cursor-pointer hover:underline"
              style={{ paddingLeft: (item.level - 1) * 20 }}
              key={index}
              onClick={() => scrollToTarget('h' + item.level + '-' + item.index)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  scrollToTarget('h' + item.level + '-' + item.index)
                }
              }}
              tabIndex={0}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Article */}
      <article>
        <ReactMarkdown
          className="markdown-body"
          remarkPlugins={[gfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
        >
          {markdownText}
        </ReactMarkdown>
        <div id="comments" />
      </article>
    </div>
  );
}

export default PostPage;
