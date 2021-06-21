import PostContent from './post-content' ;
import Directory from '../../../component/directory';
import styles from './index.module.css';
import { useCallback, useState } from 'react';

function PostPage() {
  const [headerList, setHeaderList] = useState([]);

  const handleDirChange = useCallback(item => {
    setHeaderList(headerList => [...headerList, item]);
  }, []);

  const handleComplete = useCallback(() => {
    setHeaderList([]);
  }, []);

  return (
    <div className={styles['post-page']}>
      <Directory headerList={headerList} onComplete={handleComplete} />
      <PostContent onDirChange={handleDirChange} /> 
    </div>
  );
}

export default PostPage;