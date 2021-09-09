import { useEffect } from 'react';
import styles from './index.module.css';

export default function About () {
  useEffect(() => {
    document.title = '关于我';
  }, [])

  return (
    <article className={styles.about}>
      <p>你好，我是一名华东师范大学的本科学生，现在在参加秋招苦逼找工作中。</p>
      <br />
      <table>
        <tbody>
        <tr>
          <td>邮箱: </td>
          <td><a href="mailto:qingheban@gmail.com">qingheban@gmail.com</a></td>
        </tr>
        <tr>
          <td>Github: </td>
          <td><a href="https://github.com/banqinghe" target="_blank" rel="noreferrer">banqinghe</a></td>
        </tr>
        </tbody>
      </table>
    </article>
  )
}