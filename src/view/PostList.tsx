import { Link } from 'react-router-dom';
import postData from '../config/post-list.json';

function PostList() {
  return (
    <div className="w-6/12 mx-auto">
      {postData.map(({title, filename, date, pathname, tags, description}) => (
        <section key={filename} className="mb-6">
          <h2 className="mb-2 text-xl font-bold hover:underline"><Link to={pathname}>{title}</Link></h2>
            <div className="flex items-center">
              <div className="mr-3 text-xs text-gray-400">{date}</div>
              {tags && tags.map(tag => (
                <div key={tag} className="flex px-1 py-0.5 mr-1.5 bg-gray-100 rounded-md">
                  <span className="text-xs text-gray-600">{tag}</span>
                </div>
              ))}
            </div>
          {description && <div className="text-gray-700 text-sm mt-2">{description}</div>}
        </section>
      ))}
    </div>
  );
}

export default PostList;
