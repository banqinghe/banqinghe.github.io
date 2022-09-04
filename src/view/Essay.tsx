import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEssayByFilename } from '@/utils';
import Markdown from '@/components/Markdown';
import urls from '@/config/urls.json';
import { EssayInfo, EssayList } from '@/types';

function Essay() {
  const navigate = useNavigate();
  const params = useParams();
  const filename = decodeURIComponent(params.pathname || '');

  const [essayList, setEssayList] = useState<EssayList>([]);
  const [currentEssayInfo, setCurrentEssayInfo] = useState<EssayInfo>({
    title: '',
    date: '',
    pathname: '',
  });
  const [markdownText, setMarkdownText] = useState('');
  const [catalogFold, setCatalogFold] = useState(true);

  const redirectToNotFound = () => {
    navigate('../404', { replace: true });
  };

  useEffect(() => {
    const fetchEssay = async () => {
      let list = [];
      try {
        const res = await fetch(urls['essay-list']);
        list = await res.json();
        console.log('list', list);

        setEssayList(list);
      } catch (err) {
        console.error('Failed to fetch essay list', err);
      }
      if (!list.length) {
        redirectToNotFound();
        return;
      }

      if (!filename) {
        navigate(list[0].pathname);
        return;
      }

      try {
        const res = await fetch(getEssayByFilename(filename));
        if (res.status === 404) {
          throw new Error('Essay not found');
        }
        const text = await res.text();
        setMarkdownText(text);
      } catch (err) {
        console.error('Failed to fetch essay', err);
        redirectToNotFound();
      }

      const currentEssay = list.find(
        (post: { title: string }) => post.title === filename
      );
      document.title = currentEssay.title + ' - bqh blog';
      setCurrentEssayInfo(currentEssay);
    };

    fetchEssay();
  }, [filename]);

  const toggleCatalog = () => {
    setCatalogFold(prev => !prev);
  };

  useEffect(() => {
    window.addEventListener('click', toggleCatalog);
    return () => {
      window.removeEventListener('click', toggleCatalog);
    };
  }, []);

  return (
    <div className="flex gap-12 w-10/12 md:w-9/12 mx-auto">
      {/* PC Catalog */}
      <div className="hidden lg:block p-4 pr-8">
        <h2 className="mb-4 pl-4 font-bold text-md text-gray-600">目录</h2>
        <ul className="w-64 space-y-1">
          {essayList.map(essay => (
            <li key={essay.title}>
              <Link
                className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-100 text-xs"
                to={essay.pathname}
              >
                <span className="truncate text-sm" style={{ maxWidth: 200 }}>
                  {essay.title}
                </span>
                <span className="italic text-gray-500">{essay.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Catalog */}
      <div
        className="mobile-catalog fixed top-14 left-0 py-3 bg-white shadow-sm transition border-r"
        style={{
          height: 'calc(100vh - 56px)',
          transform: catalogFold ? 'translateX(-260px)' : '',
        }}
      >
        <h2 className="mb-4 pl-4 font-bold text-md text-gray-600">目录</h2>
        <ul className="w-64 space-y-1">
          {essayList.map(essay => (
            <li key={essay.title}>
              <Link
                className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-100 text-xs"
                to={essay.pathname}
              >
                <span className="truncate text-sm" style={{ maxWidth: 200 }}>
                  {essay.title}
                </span>
                <span className="italic text-gray-500">{essay.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Article */}
      <article>
        <Markdown className="essay" text={markdownText} />
        <div className="mt-4 text-right text-sm italic text-gray-500">
          {currentEssayInfo.date}
        </div>
      </article>
    </div>
  );
}

export default Essay;
