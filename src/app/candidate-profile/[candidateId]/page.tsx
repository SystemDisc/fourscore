import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';

import ProfileAnswers from '@/components/molecules/profile/profile-answers';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import authOptions from '@/utils/auth-options';
import { calculateMatches, getCandidateAnswerScore } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params: { candidateId } }: { params: { candidateId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/'); // TODO: Show a public view of the candidate profile
  }
  const { candidates, currentUser } = await calculateMatches(session.user);
  const candidate = candidates.find((candidate) => candidate.id === candidateId);

  if (!candidate) {
    notFound();
  }

  const candidateQuestionsWithScore = await getCandidateAnswerScore(session.user, candidateId);

  return (
    <MainCard>
      <MainNav />
      <ProfileBanner
        currentUser={currentUser}
        candidate={candidate}
      />
      <ProfileAnswers
        candidate={candidate}
        candidateQuestionsWithScore={candidateQuestionsWithScore}
      />
    </MainCard>
  );
}
