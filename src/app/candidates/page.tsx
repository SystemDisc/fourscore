import Button from '@/components/atoms/button';
import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import AuthButton from '@/components/molecules/auth-button';
import CandidateList from '@/components/molecules/candidate-list';
import { CandidateResult } from '@/types';
import authOptions from '@/utils/auth-options';
import { renderMarkdown } from '@/utils/markdown';
import { getCandidates, getPoll } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const data = await getPoll(session?.user);
    if (data.allAnswers.length > 0) {
      redirect('/candidate-matches');
    } else {
      redirect('/poll');
    }
  }

  const candidates = await (
    await getCandidates()
  ).reduce(
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

  console.dir({ descriptions: candidates.map((c) => c.candidateData?.description) }, { depth: null });

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
        <div className='mb-4 text-center'>
          <h2 className='text-2xl text-center border-b border-black w-auto inline-block'>
            President of The United States of America
          </h2>
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
          {session?.user ? (
            <Button
              isLink
              href='/dashboard'
            >
              Go to Dashboard
            </Button>
          ) : (
            <AuthButton isGreen />
          )}
        </div>
      </section>
      <Disclaimer className='text-justify text-sm p-4 bg-neutral-100 border-t border-neutral-300' />
    </MainCard>
  );
}
