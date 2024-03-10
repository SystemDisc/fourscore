'use client';

import Button from '@/components/atoms/button';
import { signOut } from 'next-auth/react';

export default function MainNav() {
  return (
    <nav className='flex justify-end p-4'>
      <Button onClick={() => signOut()}>
        Sign Out
      </Button>
    </nav>
  );
}
