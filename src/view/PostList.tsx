import { useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import { globalContext } from '@/store';
import urls from '@/config/urls.json';

function PostList() {
  const { state, dispatch } = useContext(globalContext);
  const { postList } = state;

  const navigate = useNavigate();
  const params = useParams();

  // pagination info
  const total = postList.length;
  const currentPageNumber = parseInt(params.pageNumber ?? '1', 10);
  const pageSize = 15;

  useEffect(() => {
    document.title = 'bqh blog';

    fetch(urls['post-list'])
      .then(res => res.json())
      .then(postList => {
        dispatch({
          type: 'updatePostList',
          payload: {
            postList,
          },
        });
      });
  }, []);

  return (
    <div className="w-10/12 md:w-9/12 xl:w-6/12 mx-auto pb-8">
      {postList
        .slice((currentPageNumber - 1) * pageSize, currentPageNumber * pageSize)
        .map(({ title, filename, date, pathname, tags, description }) => (
          <section key={filename} className="mb-6">
            <h2 className="mb-2 text-xl font-bold hover:underline">
              <Link to={pathname}>{title}</Link>
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
        className="absolute bottom-0"
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
