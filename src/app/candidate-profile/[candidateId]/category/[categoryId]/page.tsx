import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileCategory from '@/components/molecules/profile/profile-category';
import authOptions from '@/utils/auth-options';
import { calculateMatches, getCandidateAnswerScore } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

export default async function Page({
  params: { candidateId, categoryId },
}: {
  params: { candidateId: string; categoryId: string };
}) {
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
  const category = candidateQuestionsWithScore.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <ProfileBanner
        currentUser={currentUser}
        candidate={candidate}
      />
      <ProfileCategory
        candidate={candidate}
        category={category}
      />
    </>
  );
}
