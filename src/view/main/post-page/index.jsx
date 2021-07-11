import PostContent from './post-content' ;
import Directory from '../../../component/directory';
import styles from './index.module.css';
import { useCallback, useState } from 'react';

function PostPage() {
  const [headerList, setHeaderList] = useState([]);

  // 检测到新标题，添加到当前目录尾部
  const handleDirChange = useCallback(item => {
    setHeaderList(headerList => [...headerList, item]);
  }, []);

  const handleChangeContent = useCallback(() => {
    setHeaderList([]);
  }, []);

  const handleComplete = useCallback(() => {
    setHeaderList([]);
  }, []);

  return (
    <>
      <Directory headerList={headerList} onComplete={handleComplete} />
      <div className={styles['post-page']}>
        <PostContent onDirChange={handleDirChange} onClear={handleChangeContent} /> 
      </div>
    </>
  );
}

export default PostPage;