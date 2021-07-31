import { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import styles from './index.module.css';

function Directory(props) {
  const { headerList } = props;
  const [collapse, setCollapse] = useState(true);

  const scrollToTarget = (id) => {
    document.getElementById(id).scrollIntoView();
  };

  const flipCollapseStatus = () => {
    setCollapse(prevStatus => !prevStatus);
  };

  const showDirectoryBySelection = useCallback(() => {
    const selectedText = window.getSelection().toString();
    if (!selectedText) {
      return;
    }
    if (selectedText.indexOf('的') !== -1) {
      flipCollapseStatus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', showDirectoryBySelection);
    return () => {
      window.removeEventListener('mouseup', showDirectoryBySelection);
    }
    
  }, [showDirectoryBySelection]);

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
