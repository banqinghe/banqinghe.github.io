import { useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './index.module.css';

function Directory(props) {
  const { headerList } = props;
  const [collapse, setCollapse] = useState(false);

  // const [listToRender, setListToRender] = useState([]);

  // useEffect(() => {
  //   setListToRender([...listToRender, ])
  // }, [headerList]);

  // yarn start 后有bug，会出现重复目录项，以下为去重代码
  // useEffect(() => {
  //   let existSum = 0;
  //   for (let i = 0; i < headerList.length; i++) {
  //     let exist = false;
  //     for (let j = 0; j < listToRender.length; j++) {
  //       if (isEqual(headerList[i], listToRender[j])) {
  //         exist = true;
  //         existSum++;
  //         break;
  //       }
  //     }
  //     // 开发环境下 headerList 会有重复项
  //     if (!exist) {
  //       setListToRender([headerList[i], ...listToRender])
  //     }
  //   }
  //   // 条目去重
  //   if (existSum && existSum >= headerList.length) {
  //     onComplete();
  //   }
  // }, [headerList, listToRender, onComplete]);

  const scrollToTarget = (id) => {
    document.getElementById(id).scrollIntoView();
  };

  useEffect(() => { 
    window.addEventListener('dblclick', () => {
      setCollapse(prevStatus => !prevStatus);
    })
  }, []);

  return (
    <div className={cn(styles.directory, {[styles.collapse]: collapse})}>
      <ul className={styles.list}>
        {[...headerList].map(({id, content}) => (
          <li
            className={cn(styles[`list-item-${id[0]}`], styles['list-item'])}
            key={id}
            onClick={() => scrollToTarget(id)}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Directory;
