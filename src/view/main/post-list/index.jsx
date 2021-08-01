import { useEffect } from 'react';
import data from '../../../config/post-list.json';
import styles from './index.module.css';

function Home() {
  useEffect(() => {
    document.title = 'bqh\'s blog';
  }, []);

  return (
    <div className={styles.content}>
      {data.map(info => (
          <article key={info.filename} className={styles['post-item']}>
            <h2 className={styles['post-title']}>
              <a href={`#${info.pathname}`}>{info.title}</a>
            </h2>
            <div className={styles['post-info']}>
              <p className={styles['post-date']}>{info.date}</p>
              {info.tags && info.tags.map(tag => <div className={styles['tag']} key={tag}>{tag}</div>)}
            </div>
            {info.description && <p className={styles.description}>{info.description}</p>}
          </article>
        ))}
    </div>
  );
}

export default Home;
