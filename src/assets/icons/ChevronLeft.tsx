import { IconProps } from './index.d';

function ChevronLeft(props: IconProps) {
  const {
    className = '',
    style,
  } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export default ChevronLeft;
