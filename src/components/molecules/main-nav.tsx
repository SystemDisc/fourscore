'use client';

import Button from '@/components/atoms/button';
import { signIn, signOut } from 'next-auth/react';
import LinkWithBackDetection from './link-with-back-detection';

export default function MainNav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className='flex justify-between p-4'>
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
      ) : (
        <>
          <LinkWithBackDetection
            isButton
            href='/candidates'
            className='text-sm'
          >
            View Candidates
          </LinkWithBackDetection>
          <Button
            className='text-xs sm:text-base'
            buttonType='flat'
            onClick={() => signIn()}
          >
            Sign In / Register
          </Button>
        </>
      )}
    </nav>
  );
}
