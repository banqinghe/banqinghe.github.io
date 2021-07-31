import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from 'lodash';
import cn from 'classnames';
import styles from './index.module.css';

function Header() {
  const history = useHistory();
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);

  const changeVisibleByScroll = () => {
    const currentScrollTop = document.documentElement.scrollTop;
    const isDown = currentScrollTop > lastScrollTop.current;
    lastScrollTop.current  = currentScrollTop;
    setVisible(!isDown);
  };

  const handleScroll = throttle(changeVisibleByScroll, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <header className={cn(styles['blog-header'], visible ? null : styles.collapse)}>
      <div className={styles['blog-title']} onClick={() => { history.push('/'); }}>bqh's blog</div>
      <div className={styles['blog-menu']}>
        <div className={styles['menu-item']} onClick={() => { history.push('/about'); }}>关于我</div>
      </div>
    </header>
  );
}

export default Header;
