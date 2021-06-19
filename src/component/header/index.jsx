import { useHistory } from 'react-router-dom';
import styles from './index.module.css';

function Header() {
  const history = useHistory();

  return (
    <header className={styles['blog-header']}>
      <div className={styles['blog-title']} onClick={() => { history.push('/'); }}>bqh's blog</div>
    </header>
  );
}

export default Header;
