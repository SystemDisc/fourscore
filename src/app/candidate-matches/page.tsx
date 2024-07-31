import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import CandidateList from '@/components/molecules/candidate-list';
import LinkWithBackDetection from '@/components/molecules/link-with-back-detection';
import { CandidateResult } from '@/types';
import authOptions from '@/utils/auth-options';
import { renderMarkdown } from '@/utils/markdown';
import { calculateMatches } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }

  const result = await calculateMatches(session.user);
  const { currentUser } = result;

  const candidates = await result.candidates.reduce(
    async (cList, c) => [
      ...(await cList),
      {
        ...c,
        candidateData: c.candidateData && {
          ...c.candidateData,
          description: c.candidateData?.description && (await renderMarkdown(c.candidateData.description)),
        },
      },
    ],
    Promise.resolve([] as CandidateResult[]),
  );

  const pollPercentage = Math.round((currentUser.questionsAnswered / currentUser.questionsTotal) * 100);

  return (
    <MainCard>
      <section className='flex flex-col gap-4'>
        <header className='w-full p-4 bg-gradient-to-tr from-[#22C064] to-[#69F7A5] text-white'>
          <h1 className='text-4xl'>My Ballot</h1>
          <h2>United States of America Presidential Election</h2>
          <h3>Election Day - Tuesday, November 5, 2024</h3>
          <div className='grid grid-cols-[1fr_max-content] gasp-4 mt-4'>
            <div>
              <div className='inline-flex flex-col items-center'>
                <h4>Poll Complete</h4>
                <span>{pollPercentage}%</span>
              </div>
            </div>
            <div className='flex justify-end'>
              {pollPercentage === 100 ? (
                <LinkWithBackDetection
                  buttonType='white'
                  isButton
                  href='/dashboard'
                >
                  Go to Dashboard
                </LinkWithBackDetection>
              ) : (
                <LinkWithBackDetection
                  buttonType='white'
                  isButton
                  href='/poll'
                >
                  Finish Poll
                </LinkWithBackDetection>
              )}
            </div>
          </div>
        </header>
      </section>
      <div className='max-w-lg mx-auto w-full'>
        <section className='p-4'>
          <div className='grid [grid-template-columns:3rem_1fr] mb-4'>
            <div className='flex justify-center items-end text-center text-sm sm:text-base'>Pledge Support</div>
            <h2 className='flex justify-center items-end text-lg sm:text-xl text-center'>
              <div className='border-b border-black w-auto inline-block'>
                <span className='font-bold'>Candidates</span> in
                <br className='sm:hidden' /> The United States of America
              </div>
            </h2>
          </div>
          <CandidateList candidates={candidates} />
        </section>
        <section className='p-4 pt-0'>
          <div className='flex justify-center'>
            <LinkWithBackDetection
              isButton
              href='/dashboard'
            >
              Go to Dashboard
            </LinkWithBackDetection>
          </div>
        </section>
      </div>
      <Disclaimer className='text-justify text-sm p-4 bg-neutral-100 border-t border-neutral-300' />
    </MainCard>
  );
}
