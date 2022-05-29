import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import UpdatingBar from '@/components/UpdatingBar';
import { isHttpLink } from '@/utils';
import { postListState } from '@/recoil/atom';
import { useRecoilState } from 'recoil';
import cn from 'classnames';
import urls from '@/config/urls.json';

function PostList() {
  const [postList, setPostList] = useRecoilState(postListState);

  const [updating, setUpdating] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  // pagination info
  const total = postList.length;
  const currentPageNumber = params.pageNumber ? Number(params.pageNumber) : 1;
  const pageSize = 15;

  useEffect(() => {
    document.title = 'bqh blog';

    fetch(urls['post-list'])
      .then(res => res.json())
      .then(serverPostList => {
        if (JSON.stringify(postList) === JSON.stringify(serverPostList)) {
          return;
        }
        setPostList(serverPostList);
      })
      .finally(() => {
        setUpdating(false);
        setTimeout(() => {
          document.getElementById('update-bar')!.style.display = 'none';
        }, 1500);
      });
  }, []);

  return (
    <div className="relative w-10/12 md:w-9/12 xl:w-6/12 mx-auto pb-8">
      <UpdatingBar updating={updating} />
      {postList
        .slice((currentPageNumber - 1) * pageSize, currentPageNumber * pageSize)
        .map(({ title, filename, date, pathname, tags, description }) => (
          <section key={filename} className="mb-6">
            <h2 className="mb-2 text-xl font-bold hover:underline">
              {isHttpLink(pathname) ? (
                <a href={pathname}>{title}</a>
              ) : (
                <Link to={pathname}>{title}</Link>
              )}
            </h2>
            <div className="flex items-center">
              <div className="mr-3 text-xs text-gray-400">{date}</div>
              {tags &&
                tags.map(tag => (
                  <div
                    key={tag}
                    className="flex px-1 py-0.5 mr-1.5 bg-gray-100 rounded-md"
                  >
                    <span className="text-xs text-gray-600">{tag}</span>
                  </div>
                ))}
            </div>
            {description && (
              <div className="text-gray-700 text-sm mt-2">{description}</div>
            )}
          </section>
        ))}
      <Pagination
        className={cn('absolute bottom-0', { hidden: updating })}
        shortcut
        total={total}
        pageSize={pageSize}
        current={currentPageNumber}
        onChange={newPage => {
          if (newPage > 1) {
            navigate(`/page/${newPage}`);
          } else if (currentPageNumber !== 1) {
            navigate('/');
          }
        }}
      />
    </div>
  );
}

export default PostList;
