import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export interface BaseButtonProps {
  buttonType?: 'default' | 'red' | 'white' | 'flat-black' | 'flat-white';
}

export interface ButtonProps extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  isLink?: false;
}

export interface LinkPropsExtended extends BaseButtonProps, AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {
  isLink: true;
  href: string;
}

type Props = ButtonProps | LinkPropsExtended;

export default function Button(props: Props) {
  const { buttonType = 'default', children, isLink, className, ...otherProps } = props;
  const disabled = isLink ? undefined : props.disabled;
  const href = isLink ? props.href : undefined;

  const ButtonClass = isLink ? Link : 'button';
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
      {buttonType === 'white' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 rounded-full tracking-widest bg-white text-black shadow-[#000_0px_2px_2px] active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] hover:text-[#22c064] transition duration-200 hover:border-[#22c064] relative overflow-hidden',
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
      {buttonType === 'flat-black' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 border border-black rounded-full tracking-widest bg-transparent text-black active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] transition duration-200 hover:text-[#22c064] hover:border-[#22c064]',
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
      {buttonType === 'flat-white' && (
        <ButtonClass
          className={classNames(
            'inline-flex justify-center items-center px-3 py-2 border border-white rounded-full tracking-widest bg-transparent text-white active:shadow-[inset_3px_3px_5px_0px_rgba(0,_0,_0,_0.3)] transition duration-200 hover:text-[#22c064] hover:border-[#22c064]',
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
