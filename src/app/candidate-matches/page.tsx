import { calculateMatches } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import MainCard from '@/components/atoms/main-card';
import Button from '@/components/atoms/button';
import { BsStar, BsStarFill } from 'react-icons/bs';
import ToggleSwitch from '@/components/atoms/toggle-switch';
import PledgeToggle from '@/components/molecules/pledge-toggle';
import CandidateCard from '@/components/molecules/candidate-card';
import CandidateList from '@/components/molecules/candidate-list';
import authOptions from '@/utils/auth-options';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }

  const candidates = await calculateMatches(session.user);

  return (
    <MainCard>
      <section className='flex flex-col gap-4'>
        <header className='w-full p-4 bg-gradient-to-tr from-[#22C064] to-[#69F7A5] text-white'>
          <h1 className='text-4xl'>My Ballot</h1>
          <h2>United States of America Presidential Election</h2>
          <h3>Election Day - Tuesday, November 5, 2024</h3>
          <div className='grid grid-cols-2 gasp-4 mt-4'>
            <div>
              <div className='inline-flex flex-col items-center'>
                <h4>Poll Complete</h4>
                <span>
                  100%
                </span>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button buttonType='white' disabled>
                Finish Poll
              </Button>
            </div>
          </div>
        </header>
      </section>
      <section className='p-4'>
        <div className='grid [grid-template-columns:3rem_1fr] mb-2'>
          <div className='flex justify-center text-center'>
            Pledge Support
          </div>
          <h2 className='text-2xl text-center mb-4'>President of The United States of America</h2>
        </div>
        <CandidateList candidates={candidates} />
      </section>
    </MainCard>
  );
}
