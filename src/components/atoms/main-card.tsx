import classNames from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

export default function MainCard({ children, className }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <main
      className={classNames(
        'max-w-2xl mx-auto md:my-4 md:border md:border-neutral-300 md:rounded-lg md:shadow-[#000_0px_2px_2px] bg-white overflow-hidden min-h-[100dvh] md:min-h-0 flex flex-col justify-between',
        className,
      )}
    >
      {children}
    </main>
  );
}
