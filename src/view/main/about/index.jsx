// import cn from 'classnames';
import styles from './index.module.css';

export default function About () {
  return (
    <article className={styles.about}>
      <p>你好，我是一名华东师范大学的本科学生，同时也在做前端开发实习生。</p>
      <br />
      <table>
        <tr>
          <td>邮箱: </td>
          <td><a href="mailto:qingheban@gmail.com">qingheban@gmail.com</a></td>
        </tr>
        <tr>
          <td>Github: </td>
          <td><a href="https://github.com/banqinghe">banqinghe</a></td>
        </tr>
      </table>
    </article>
  )
}