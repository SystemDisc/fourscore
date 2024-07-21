import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileCategory from '@/components/molecules/profile/profile-category';
import { CategoryWithQuestions, CategoryWithQuestionsAndScore } from '@/types';
import authOptions from '@/utils/auth-options';
import { calculateMatches, getCandidateAnswerScore, getCandidates } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { candidateId, categoryId },
}: {
  params: { candidateId: string; categoryId: string };
}) {
  const session = await getServerSession(authOptions);
  const { candidates, currentUser } = session?.user
    ? await calculateMatches(session.user)
    : { candidates: await getCandidates(), currentUser: undefined };
  const candidate = candidates.find((candidate) => candidate.id === candidateId);

  if (!candidate) {
    notFound();
  }

  const candidateQuestionsWithScore = currentUser && (await getCandidateAnswerScore(session?.user, candidateId));
  const category: (CategoryWithQuestions & Partial<CategoryWithQuestionsAndScore>) | undefined =
    candidateQuestionsWithScore
      ? candidateQuestionsWithScore.find((c) => c.id === categoryId)
      : candidate.categories?.find((c) => c.id === categoryId);

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
