'use client';

import Button from '@/components/atoms/button';
import classNames from 'classnames';
import { signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import LinkWithBackDetection from './link-with-back-detection';

export default function MainNav({ loggedIn, className }: { loggedIn: boolean; className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={classNames('flex justify-between p-4', className)}>
      {loggedIn ? (
        <>
          <LinkWithBackDetection
            isButton
            href='/poll'
            className='text-sm'
          >
            View Poll
          </LinkWithBackDetection>
          <LinkWithBackDetection
            isButton
            href='/candidate-matches'
            className='text-sm'
          >
            Candidates
          </LinkWithBackDetection>
          <Button
            onClick={() => signOut()}
            className='text-sm'
          >
            Sign Out
          </Button>
        </>
      ) : pathname === '/candidates' ? (
        <>
          <LinkWithBackDetection
            isButton
            buttonType='white'
            href='/'
            className='text-sm'
          >
            Home
          </LinkWithBackDetection>
          <Button
            className='text-xs sm:text-base'
            buttonType='white'
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        </>
      ) : (
        <>
          <LinkWithBackDetection
            isButton
            buttonType='white'
            href='/candidates'
            className='text-sm'
          >
            View Candidates
          </LinkWithBackDetection>
          <Button
            className='text-xs sm:text-base'
            buttonType='white'
            onClick={() => signIn()}
          >
            Sign In / Register
          </Button>
        </>
      )}
    </nav>
  );
}
