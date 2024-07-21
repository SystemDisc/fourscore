'use client';

import Button from '@/components/atoms/button';
import Loading from '@/components/atoms/loading';
import MainCard from '@/components/atoms/main-card';
import { deleteUser } from '@/utils/server-actions';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);

  return (
    <MainCard>
      <div className='p-4 flex justify-center gap-4'>
        {(status === 'loading' || loading) && <Loading />}
        {status !== 'loading' && !loading && (
          <>
            {!session?.user && <Button onClick={() => signIn()}>Sign in</Button>}
            {session?.user && (
              <>
                <Button
                  buttonType='red'
                  onClick={async () => {
                    setLoading(true);
                    await deleteUser(session.user);
                    await signOut();
                    setLoading(false);
                    router.replace('/');
                  }}
                >
                  Delete account
                </Button>
                <Button
                  isLink
                  href='/dashboard'
                >
                  Dashboard
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </MainCard>
  );
}
