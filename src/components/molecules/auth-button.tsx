'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../atoms/button';

export default function AuthButton({
  isCandidate,
}: {
  isCandidate?: boolean,
}) {
  const { data: session } = useSession();

  return (
    <>
      {!session && !isCandidate &&
        <Button buttonType='flat' onClick={() => signIn()}>
          Sign in
        </Button>
      }
      {session && !isCandidate &&
        <Button buttonType='flat' onClick={() => signOut()}>
          Sign out
        </Button>
      }
      {!session && isCandidate &&
        <Button className='border-white text-white hover:!text-neutral-300' buttonType='flat' onClick={() => signIn()}>
          Sign in
        </Button>
      }
      {session && isCandidate &&
        <Button className='border-white text-white hover:!text-neutral-300' buttonType='flat' onClick={() => signOut()}>
          Sign out
        </Button>
      }
    </>
  );
}
