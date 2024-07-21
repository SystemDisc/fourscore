import classNames from 'classnames';
import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react';

export default function Button({
  disabled,
  buttonType = 'default',
  children,
  isLink = false,
  className,
  href,
  ...props
}: {
  buttonType?: 'red' | 'default' | 'flat' | 'white';
  isLink?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ButtonClass = isLink ? Link : 'button';
  const otherProps = isLink
    ? (props as HTMLAttributes<HTMLAnchorElement>)
    : (props as HTMLAttributes<HTMLButtonElement>);
  return (
    <>
      {buttonType === 'default' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 border border-white rounded-full tracking-wider from-[#69F7A5] to-[#22C064] bg-gradient-to-bl shadow-[#000_0px_2px_2px] text-white active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-200',
            {
              '!opacity-60 hover:!text-white !cursor-not-allowed active:!shadow-[#000_0px_2px_2px]': disabled,
            },
            className,
          )}
          href={isLink ? (disabled ? 'javascript:void(0)' : href) : undefined}
          disabled={disabled}
          {...(otherProps as any)}
        >
          {children}
        </ButtonClass>
      )}
      {buttonType === 'white' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 rounded-full tracking-widest bg-white text-black shadow-[#000_0px_2px_2px] active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-700 relative overflow-hidden',
            {
              '!opacity-60 hover:!text-black active:!shadow-[#000_0px_2px_2px] !cursor-not-allowed': disabled,
            },
            className,
          )}
          href={isLink ? (disabled ? 'javascript:void(0)' : href) : undefined}
          disabled={disabled}
          {...(otherProps as any)}
        >
          {children}
        </ButtonClass>
      )}
      {buttonType === 'red' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 border border-white rounded-full tracking-widest from-red-500 to-red-800 bg-gradient-to-bl shadow-[#000_0px_2px_2px] text-white active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-200',
            {
              '!opacity-60 hover:!text-white !cursor-not-allowed active:!shadow-[#000_0px_2px_2px]': disabled,
            },
            className,
          )}
          href={isLink ? (disabled ? 'javascript:void(0)' : href) : undefined}
          disabled={disabled}
          {...(otherProps as any)}
        >
          {children}
        </ButtonClass>
      )}
      {buttonType === 'flat' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 border border-black rounded-full tracking-widest bg-transparent text-black active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-700',
            {
              '!opacity-30 !cursor-not-allowed active:!shadow-none': disabled,
            },
            className,
          )}
          href={isLink ? (disabled ? 'javascript:void(0)' : href) : undefined}
          disabled={disabled}
          {...(otherProps as any)}
        >
          {children}
        </ButtonClass>
      )}
    </>
  );
}
