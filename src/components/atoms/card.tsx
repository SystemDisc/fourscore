import classNames from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

export default function Card({ children, className }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={classNames(
        'border border-neutral-300 rounded-lg shadow-[#000_0px_2px_2px] bg-white overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );
}
