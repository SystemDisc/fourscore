import Button from '@/components/atoms/button';
import Disclaimer from '@/components/atoms/disclaimer';
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
      <MainNav />
      <Disclaimer className='p-4 pt-0 text-justify text-xs' />
    </MainCard>
  );
}
