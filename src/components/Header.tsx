import { useState, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';
import { Link } from 'react-router-dom';

function NavItem(props: { title: string; link: string; }) {
  const { title, link } = props;
  return (
    <li>
      <Link to={link} className="flex justify-center items-center h-full w-16 hover:font-bold">{title}</Link>
    </li>
  );
};

function Header() {
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);

  const changeVisibleByScroll = () => {
    const currentScrollTop = document.documentElement.scrollTop;
    const isDown = currentScrollTop > lastScrollTop.current;
    lastScrollTop.current = currentScrollTop;
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
    <header className={'z-10 sticky top-0 flex justify-between items-center h-14 px-4 md:px-12 bg-white bg-opacity-90 ' +
      'border-b border-gray-100 transition-transform duration-300 transform ' + (visible ? '' : '-translate-y-14')} >
      <h1 className="flex items-center h-full text-lg md:text-2xl font-bold"><Link to="/">bqh blog</Link></h1>
      <nav className="h-full">
        <ul className="flex h-full">
          <NavItem title="笔记" link="note" />
          <NavItem title="盒子" link="demo-box" />
          <NavItem title="关于" link="about" />
        </ul>
      </nav>
    </header>
  );
}

export default Header;
