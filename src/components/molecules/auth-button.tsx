'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../atoms/button';

export default function AuthButton({ isCandidate, isGreen = false }: { isCandidate?: boolean; isGreen?: boolean }) {
  const { data: session } = useSession();

  return (
    <>
      {!session && !isCandidate && (
        <Button
          className='text-xs sm:text-base'
          buttonType={isGreen ? 'default' : 'flat'}
          onClick={() => signIn()}
        >
          Sign in / Register
        </Button>
      )}
      {session && !isCandidate && (
        <Button
          buttonType={isGreen ? 'default' : 'flat'}
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      )}
      {!session && isCandidate && (
        <Button
          className='text-xs sm:text-base border-white text-white hover:!text-neutral-300'
          buttonType={isGreen ? 'default' : 'flat'}
          onClick={() => signIn()}
        >
          Sign in / Register
        </Button>
      )}
      {session && isCandidate && (
        <Button
          className='border-white text-white hover:!text-neutral-300'
          buttonType={isGreen ? 'default' : 'flat'}
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      )}
    </>
  );
}
