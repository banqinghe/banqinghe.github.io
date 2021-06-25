import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import cn from 'classnames';
import styles from './index.module.css';

function Directory(props) {
  const { headerList, onComplete } = props;

  const [listToRender, setListToRender] = useState([]);

  useEffect(() => {
    let existSum = 0;
    for (let i = 0; i < headerList.length; i++) {
      let exist = false;
      for (let j = 0; j < listToRender.length; j++) {
        if (isEqual(headerList[i], listToRender[j])) {
          exist = true;
          existSum++;
          break;
        }
      }
      if (!exist) {
        setListToRender([headerList[i], ...listToRender])
      }
    }
    if (existSum && existSum >= headerList.length) {
      onComplete();
    }
  }, [headerList, listToRender, onComplete]);

  const scrollToTarget = (id) => {
    console.log('scroll to id:', id);
    document.getElementById(id).scrollIntoView();
  };

  return (
    <div className={styles.directory}>
      <ul className={styles.list}>
        {[...listToRender].map(({id, content}) => (
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
