import { IconFresh } from '@/icons';

interface UpdatingBarProps {
  updating: boolean;
}

export default function UpdatingBar(props: UpdatingBarProps) {
  const { updating } = props;

  return (
    <div
      id="update-bar"
      className={`absolute top-0 w-full py-4 transition-all duration-1000 backdrop-filter backdrop-blur-sm
      flex justify-center items-center gap-4 overflow-hidden bg-white bg-opacity-95 text-gray-500
      md:right-0 md:w-max md:transform md:-translate-x-full md:py-1 md:-ml-6`}
      style={Object.assign(
        {
          boxShadow: '0 0 100px #fff',
        },
        !updating
          ? {
              opacity: 0,
              padding: 0,
            }
          : {}
      )}
    >
      <IconFresh className="animate-spin animate-duration-1000 text-xl" />
      <span className="font-bold text-sm md:hidden">Updating...</span>
    </div>
  );
}
