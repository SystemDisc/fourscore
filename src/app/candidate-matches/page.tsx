import Button from '@/components/atoms/button';
import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import CandidateList from '@/components/molecules/candidate-list';
import authOptions from '@/utils/auth-options';
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

  const { candidates, currentUser } = await calculateMatches(session.user);

  const pollPercentage = Math.round(
    (currentUser.questionsAnswered / currentUser.questionsTotal) * 100
  );

  return (
    <MainCard>
      <section className="flex flex-col gap-4">
        <header className="w-full p-4 bg-gradient-to-tr from-[#22C064] to-[#69F7A5] text-white">
          <h1 className="text-4xl">My Ballot</h1>
          <h2>United States of America Presidential Election</h2>
          <h3>Election Day - Tuesday, November 5, 2024</h3>
          <div className="grid grid-cols-2 gasp-4 mt-4">
            <div>
              <div className="inline-flex flex-col items-center">
                <h4>Poll Complete</h4>
                <span>{pollPercentage}%</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                buttonType="white"
                disabled={pollPercentage === 100}
                isLink
                href="/poll"
              >
                Finish Poll
              </Button>
            </div>
          </div>
        </header>
      </section>
      <section className="p-4">
        <div className="grid [grid-template-columns:3rem_1fr] mb-2">
          <div className="flex justify-center items-end text-center">
            Pledge Support
          </div>
          <h2 className="text-2xl text-center mb-4">
            President of The United States of America
          </h2>
        </div>
        <CandidateList candidates={candidates} />
      </section>
      <section className="p-4 pt-0">
        <div className="flex justify-center">
          <Button isLink href="/dashboard">
            Go to Dashboard
          </Button>
        </div>
      </section>
      <Disclaimer className="text-justify text-sm p-4 bg-neutral-100 border-t border-neutral-300" />
    </MainCard>
  );
}
