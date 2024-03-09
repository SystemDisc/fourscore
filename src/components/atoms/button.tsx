import classNames from 'classnames';
import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react';

export default function Button({
  buttonType = 'default',
  children,
  isLink = false,
  className,
  ...props
}: {
  buttonType?: 'red' | 'default' | 'flat' | 'white';
  isLink?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ButtonClass = isLink ? Link : 'button';
  const otherProps = isLink ? props as HTMLAttributes<HTMLAnchorElement> : props as HTMLAttributes<HTMLButtonElement>;
  return (
    <>
      {buttonType === 'default' &&
        <ButtonClass className={classNames('inline-flex justify-center items-center px-4 py-2 border border-white rounded-full tracking-widest from-[#69F7A5] to-[#22C064] bg-gradient-to-bl shadow-[#000_0px_2px_2px] text-white active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-200 disabled:opacity-60 disabled:hover:text-white disabled:cursor-not-allowed disabled:active:shadow-[#000_0px_2px_2px]', className)} {...otherProps as any}>
          {children}
        </ButtonClass>
      }
      {buttonType === 'white' &&
        <div className='inline-block p-[1px] from-[#69F7A5] to-[#22C064] bg-gradient-to-bl rounded-full'>
          <ButtonClass className={classNames('inline-flex justify-center items-center px-4 py-2 rounded-full tracking-widest bg-white text-black shadow-[#000_0px_2px_2px] active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-700', className)} {...otherProps as any}>
            {children}
          </ButtonClass>
        </div>
      }
      {buttonType === 'red' &&
        <ButtonClass className={classNames('inline-flex justify-center items-center px-4 py-2 border border-black rounded-full tracking-widest bg-[#c02222] text-white active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-300', className)} {...otherProps as any}>
          {children}
        </ButtonClass>
      }
      {buttonType === 'flat' &&
        <ButtonClass className={classNames('inline-flex justify-center items-center px-4 py-2 border border-black rounded-full tracking-widest bg-transparent text-black active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:shadow-none', className)} {...otherProps as any}>
          {children}
        </ButtonClass>
      }
    </>
  );
}
