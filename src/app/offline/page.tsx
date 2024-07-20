import Button from '@/components/atoms/button';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import authOptions from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }
  return (
    <MainCard>
      <div className='text-center'>You are currently offline.</div>
    </MainCard>
  );
}
