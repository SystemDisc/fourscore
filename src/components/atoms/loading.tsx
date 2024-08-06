import classNames from 'classnames';
import Image from 'next/image';

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={classNames('flex justify-center items-center', className)}>
      <Image
        src='/images/loading.svg'
        alt='Loading...'
        width={96}
        height={96}
      />
    </div>
  );
}
