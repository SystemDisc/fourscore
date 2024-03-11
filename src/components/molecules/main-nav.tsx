'use client';

import Button from '@/components/atoms/button';
import { signOut } from 'next-auth/react';

export default function MainNav() {
  return (
    <nav className='flex justify-between p-4'>
      <Button isLink href='/poll'>
        Edit Poll
      </Button>
      <Button onClick={() => signOut()}>
        Sign Out
      </Button>
    </nav>
  );
}
