'use client';

import Button from '@/components/atoms/button';
import { signOut } from 'next-auth/react';

export default function MainNav() {
  return (
    <nav className='flex justify-between p-4'>
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
    </nav>
  );
}
