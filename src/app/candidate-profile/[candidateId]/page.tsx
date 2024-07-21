import Profile from '@/components/molecules/profile/profile';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import authOptions from '@/utils/auth-options';
import { calculateMatches, getCandidateAnswerScore, getCandidates } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function Page({ params: { candidateId } }: { params: { candidateId: string } }) {
  const session = await getServerSession(authOptions);

  const { candidates, currentUser } = session?.user
    ? await calculateMatches(session.user)
    : { candidates: await getCandidates(), currentUser: undefined };
  const candidate = candidates.find((candidate) => candidate.id === candidateId);

  if (!candidate) {
    notFound();
  }

  const candidateQuestionsWithScore = currentUser && (await getCandidateAnswerScore(session?.user, candidateId));

  return (
    <>
      <ProfileBanner
        currentUser={currentUser}
        candidate={candidate}
      />
      <Profile
        candidate={candidate}
        candidateQuestionsWithScore={candidateQuestionsWithScore}
      />
    </>
  );
}
