import React, { useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@/icons';

interface PaginationProps {
  className?: string;
  style?: React.CSSProperties;
  shortcut?: boolean;
  total: number;
  current: number;
  pageSize: number;
  onChange: (current: number) => void;
}

type PageMoveDirection = 'left' | 'right';

function Pagination(props: PaginationProps) {
  const {
    className = '',
    style,
    shortcut = false,
    total,
    current,
    pageSize,
    onChange,
  } = props;

  function movePage(direction: PageMoveDirection) {
    if (direction === 'left') {
      if (current === 1) {
        return;
      }
      onChange(current - 1);
    } else {
      if (current === totalPage) {
        return;
      }
      onChange(current + 1);
    }
  }

  function handlePaginationShortcut(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      movePage('left');
    } else if (e.key === 'ArrowRight') {
      movePage('right');
    }
  }

  if (shortcut) {
    useEffect(() => {
      window.addEventListener('keyup', handlePaginationShortcut);
      return () => {
        window.removeEventListener('keyup', handlePaginationShortcut);
      };
    }, [current]);
  }

  const totalPage = Math.ceil(total / pageSize);

  const buttonItemClass =
    'h-9 w-9 flex justify-center items-center hover:bg-gray-50 active:bg-gray-100';

  return (
    <div className={'flex space-x-2 ' + className} style={style}>
      <button
        className={buttonItemClass + ' text-xl'}
        onClick={() => movePage('left')}
      >
        <IconChevronLeft className="w-4 h-4" />
      </button>
      <ul className="flex space-x-2">
        {Array.from({ length: totalPage }, (_, index) => index + 1).map(
          number => (
            <li key={number}>
              <button
                className={buttonItemClass}
                onClick={() => onChange(number)}
                style={{
                  boxShadow: current === number ? '0 3px 0 0 #374151' : 'none',
                }}
              >
                {number}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        className={buttonItemClass + ' text-xl'}
        onClick={() => movePage('right')}
      >
        <IconChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Pagination;
