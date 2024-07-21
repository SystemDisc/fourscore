import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainCard>
      <MainNav />
      {children}
      <Disclaimer className='p-4 text-justify text-xs bg-neutral-100 border-t border-neutral-300' />
    </MainCard>
  );
}
