'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../atoms/button';

interface AuthButtonProps {
  buttonType?: 'default' | 'flat-black' | 'flat-white';
}

export default function AuthButton({ buttonType = 'flat-black' }: AuthButtonProps) {
  const { data: session } = useSession();

  return (
    <>
      {!session && (
        <Button
          className='text-xs sm:text-base'
          buttonType={buttonType}
          onClick={() => signIn()}
        >
          Sign in / Register
        </Button>
      )}
      {session && (
        <Button
          buttonType={buttonType}
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      )}
    </>
  );
}
