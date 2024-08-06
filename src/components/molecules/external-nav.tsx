'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren, useState } from 'react';
import { BsList } from 'react-icons/bs';
import Button from '../atoms/button';
import TwoColorLogo from '../atoms/icons/two-color-logo';
import AuthButton from './auth-button';

interface ExternalNavProps {
  className?: string;
  transparent?: boolean;
  buttonType?: 'default' | 'flat-black' | 'flat-white';
}

export default function ExternalNav({
  className,
  transparent = false,
  buttonType = 'default',
  children,
}: PropsWithChildren<ExternalNavProps>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={classNames(
        'p-4',
        {
          'bg-[#212224]': !transparent,
        },
        className,
      )}
    >
      <nav className='flex justify-between items-center gap-4'>
        <Link
          href='/'
          className={classNames('inline-block max-h-full [&_path]:transition [&_path]:duration-200', {
            '[&:hover_path]:fill-white': buttonType === 'default',
            '[&:hover_path]:fill-[#22c064]': buttonType !== 'default',
            '[&_path]:fill-[#22c064]': buttonType === 'default',
            '[&_path]:fill-black': buttonType === 'flat-black',
            '[&_path]:fill-white': buttonType === 'flat-white',
          })}
        >
          <TwoColorLogo
            className='max-w-[170px] relative top-[2px]'
            greenFill='#4A4A4A'
            grayFill='#4A4A4A'
            width={170}
            height={37}
          />
        </Link>
        <div className='hidden md:flex items-center gap-4'>
          <Link
            href='/about'
            className={classNames('transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            About
          </Link>
          <Link
            href='/poll'
            className={classNames('hover:cursor-pointer transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            Find Your Candidate
          </Link>
          <Link
            href='/candidate'
            className={classNames('transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            Connect With Voters
          </Link>
        </div>
        <div className='md:hidden flex items-center'>
          <Button
            buttonType={buttonType}
            onClick={() => setMenuOpen(!menuOpen)}
            className={classNames('focus:outline-none', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            <BsList />
          </Button>
        </div>
        <div className='hidden md:flex'>
          <AuthButton buttonType={buttonType} />
        </div>
      </nav>
      {menuOpen && (
        <div className='flex flex-col md:hidden mt-4 space-y-2'>
          <Link
            href='/about'
            className={classNames('transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            About
          </Link>
          <Link
            href='/poll'
            className={classNames('hover:cursor-pointer transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            Find Your Candidate
          </Link>
          <Link
            href='/candidate'
            className={classNames('transition duration-200', {
              'hover:text-white': buttonType === 'default',
              'hover:text-[#22c064]': buttonType !== 'default',
              'text-[#22c064]': buttonType === 'default',
              'text-black': buttonType === 'flat-black',
              'text-white': buttonType === 'flat-white',
            })}
          >
            Connect With Voters
          </Link>
          <div className='flex justify-center pt-4'>
            <AuthButton buttonType={buttonType} />
          </div>
        </div>
      )}
      {children}
    </header>
  );
}
