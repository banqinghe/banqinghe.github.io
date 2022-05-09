import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from '@/icons';

type AdjacentPostNav = {
  path: string;
  title: string;
};

interface AdjButtonProps {
  info: AdjacentPostNav;
  children: ReactNode;
}

function AdjButton(props: AdjButtonProps) {
  return (
    <button
      className="border border-gray-100 rounded text-gray-600 font-bold"
      style={Object.assign(
        { width: '45%' },
        props.info.path ? undefined : { opacity: 0, PointerEvents: 'none' }
      )}
      title={props.info.title}
    >
      <Link
        className="flex justify-center items-center h-full px-6 md:px-4"
        to={props.info.path}
      >
        {props.children}
      </Link>
    </button>
  );
}

interface AdjacentPostButtonGroupProps {
  left: AdjacentPostNav;
  right: AdjacentPostNav;
}

export default function AdjacentPostButtonGroup(
  props: AdjacentPostButtonGroupProps
) {
  const { left, right } = props;
  return (
    <div className="relative flex justify-between mt-12 h-12">
      <AdjButton info={left}>
        <IconChevronLeft className="absolute left-1 md:left-3 w-6 h-6" />
        <span className="w-10/12 truncate">{left.title}</span>
      </AdjButton>
      <AdjButton info={right}>
        <span className="w-10/12 truncate">{right.title}</span>
        <IconChevronRight className="absolute right-1 md:right-3 w-6 h-6" />
      </AdjButton>
    </div>
  );
}
