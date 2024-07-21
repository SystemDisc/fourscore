'use client';

import Button from '@/components/atoms/button';
import { signIn, signOut } from 'next-auth/react';

export default function MainNav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className='flex justify-between p-4'>
      {loggedIn ? (
        <>
          <Button
            isLink
            href='/poll'
            className='text-sm'
          >
            View Poll
          </Button>
          <Button
            isLink
            href='/candidate-matches'
            className='text-sm'
          >
            Candidates
          </Button>
          <Button
            onClick={() => signOut()}
            className='text-sm'
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button
            isLink
            href='/candidates'
            className='text-sm'
          >
            View Candidates
          </Button>
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
