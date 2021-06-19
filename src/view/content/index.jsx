import { useHistory } from 'react-router-dom'; 
import data from '../../config/post-list.json';
import styles from './index.module.css';

function Content() {
  const history = useHistory();

  return (
    <div className={styles.content}>
      {data.map(info => (
          <article key={info.filename} className={styles['post-item']}>
            <h2 className={styles['post-title']} onClick={() => { history.push(info.pathname); }}>{info.title}</h2>
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

export default Content;
