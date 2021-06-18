import styles from './styles.module.css';

function Header() {
  console.log(styles);
  return (
    <header className={styles['blog-header']}>
      <div className={styles['blog-title']}>bqh's blog</div>
    </header>
  );
}

export default Header;
