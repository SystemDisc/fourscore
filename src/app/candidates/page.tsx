import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import AuthButton from '@/components/molecules/auth-button';
import CandidateList from '@/components/molecules/candidate-list';
import { getCandidates } from '@/utils/server-actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const candidates = await getCandidates();

  return (
    <MainCard>
      <section className='flex flex-col gap-4'>
        <header className='w-full p-4 bg-gradient-to-tr from-[#22C064] to-[#69F7A5] text-white'>
          <h1 className='text-2xl'>
            <span className='font-bold'>Candidates</span> in The United States of America
          </h1>
          <hr className='border border-white' />
          <h2>United States of America Presidential Election</h2>
          <h3>Election Day - Tuesday, November 5, 2024</h3>
        </header>
      </section>
      <section className='p-4'>
        <div className='mb-2'>
          <h2 className='text-2xl text-center mb-4'>President of The United States of America</h2>
        </div>
        <div className='sm:max-w-md sm:mx-auto'>
          <CandidateList
            candidates={candidates}
            withoutPledging
          />
        </div>
      </section>
      <section className='p-4 pt-0'>
        <div className='flex justify-center'>
          <AuthButton isGreen />
        </div>
      </section>
      <Disclaimer className='text-justify text-sm p-4 bg-neutral-100 border-t border-neutral-300' />
    </MainCard>
  );
}
