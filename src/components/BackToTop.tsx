import { useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import { createPortal } from 'react-dom';

interface BackToTopProps {
  className?: string;
  bottom?: number | string;
  right?: number | string;
  heightThreshold?: number;
}

function BackToTop(props: BackToTopProps) {
  const { className, bottom = 50, right = 50, heightThreshold = 500 } = props;
  const cls = className ? (' ' + className) : '';

  const [isDisplay, setIsDisplay] = useState(false);

  function determineDisplay() {
    const currentScrollTop = document.documentElement.scrollTop;
    if (currentScrollTop > heightThreshold) {
      setIsDisplay(true);
    } else {
      setIsDisplay(false);
    }
  }

  const handleScroll = throttle(determineDisplay, 200);

  // Sometimes cannot back to the top. It may be due to pointer's moving when auto scroll.
  // I am not sure that it is default behavior of scrollIntoView function when its behavior
  // is set to 'smooth'.
  function handleClick() {
    document.body.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return createPortal((
    <div
      className={'fixed justify-center items-center w-10 h-10 border border-gray-100 rounded shadow-sm cursor-pointer' + cls}
      style={{ bottom, right, display: isDisplay ? 'flex' : 'none' }}
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </div>
  ), document.body);
}

export default BackToTop;
