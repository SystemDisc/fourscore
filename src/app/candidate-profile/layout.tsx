import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import authOptions from '@/utils/auth-options';
import { getServerSession } from 'next-auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <MainCard>
      <MainNav loggedIn={!!session?.user} />
      {children}
      <Disclaimer className='p-4 text-justify text-xs bg-neutral-100 border-t border-neutral-300' />
    </MainCard>
  );
}
