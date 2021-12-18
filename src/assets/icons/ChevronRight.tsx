import { IconProps } from './index.d';

function ChevronRight(props: IconProps) {
  const {
    className = '',
    style,
  } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default ChevronRight;
