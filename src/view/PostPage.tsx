import { useEffect, useState, useContext, useMemo, ReactNode } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Waline from '@waline/client';

import { globalContext } from '@/store';
import AdjacentPostButtonGroup from '@/components/AdjacentPostButtonGroup';
import { getPostUrlByFilename, CatalogNode, getHeadingInfo } from '@/utils';

function PostPage() {
  const { state, dispatch } = useContext(globalContext);
  const { postList, postIndex } = state;

  const navigate = useNavigate();
  const location = useLocation();
  const filename = location.pathname.replace(/^\/post\//, '');

  const [markdownText, setMarkdownText] = useState('');
  const [isNoContent, setIsNoContent] = useState(false);
  const [catalogList, setCatalogList] = useState<Array<CatalogNode>>([]);
  const [catalogCollapse, setCatalogCollapse] = useState(false);

  function handleSwitchCatalog(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
      setCatalogCollapse(preState => !preState);
    }
  }

  const adjacentPostList = useMemo(() => {
    const prevNav = { path: '', title: '' };
    const nextNav = { path: '', title: '' };
    for (let i = 0, len = postList.length; i < len; i++) {
      if (i !== postIndex) {
        continue;
      }
      if (postIndex + 1 < len) {
        nextNav.title = postList[i + 1].title;
        nextNav.path = postList[i + 1].pathname;
      }
      if (postIndex - 1 >= 0) {
        prevNav.title = postList[i - 1].title;
        prevNav.path = postList[i - 1].pathname;
      }
    }
    return [prevNav, nextNav];
  }, [postIndex]);

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
      markdownBody!
        .querySelectorAll('h1,h2,h3,h4,h5,h6')
        .forEach((el, index) => {
          el.id = 'h-' + index;
        });
    }
    document.documentElement.scrollIntoView();
  }, [markdownText]);

  // Fetch the markdown text by filename, url is defined at adapter.ts.
  // If response is not a markdown file, navigate to 404 page.
  useEffect(() => {
    fetch(getPostUrlByFilename(filename))
      .then(res => {
        // Vite converts files smaller than 4kb to base64 by default, so the
        // url of markdown file may be a base64 string that start with 'data:text'
        // or the filename that end with '.md'.
        if (!(/^data:text/.test(res.url) || /\.md$/.test(res.url))) {
          throw new Error(
            `Wrong path: '${location.pathname}'. Redirect to 404 page.`
          );
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
      path: filename,
    });

    const postTitle = postList.find(post => post.filename === filename)?.title;
    document.title = postTitle ? postTitle + ' - bqh blog' : filename;

    let currentIndex = 0;
    for (let i = 0, len = postList.length; i < len; i++) {
      if (location.pathname === postList[i].pathname) {
        currentIndex = i;
        break;
      }
    }
    dispatch({ type: 'viewPost', payload: { postIndex: currentIndex } });
  }, [filename]);

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
              tabIndex={0}
            >
              <a href={'#h-' + index}>{item.text}</a>
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
        <AdjacentPostButtonGroup
          left={adjacentPostList[0]}
          right={adjacentPostList[1]}
        />
        <div id="comments" />
      </article>
    </div>
  );
}

export default PostPage;
