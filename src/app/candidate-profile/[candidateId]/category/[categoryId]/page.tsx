import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileCategory from '@/components/molecules/profile/profile-category';
import { CategoryWithQuestions, CategoryWithQuestionsAndScore } from '@/types';
import authOptions from '@/utils/auth-options';
import { generateCommonMetadata } from '@/utils/helpers';
import { calculateMatches, getCandidateAnswerScore, getCandidates } from '@/utils/server-actions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params: { candidateId, categoryId },
}: {
  params: { candidateId: string; categoryId: string };
}): Promise<Metadata> {
  const candidates = await getCandidates();
  const candidate = candidates.find((candidate) => candidate.id === candidateId);
  const category: (CategoryWithQuestions & Partial<CategoryWithQuestionsAndScore>) | undefined =
    candidate?.categories?.find((c) => c.id === categoryId);

  if (!candidate || !category || !candidate.name) {
    const metadata = await generateCommonMetadata({});
    return {
      ...metadata,
      title: `${metadata.title} - 404`,
    };
  }

  return generateCommonMetadata({
    title: `${candidate.name} - ${category.name} - FourScore Candidate Survey`,
    description: `Explore ${candidate.name}'s answers to survey questions on ${category.name}. Learn more about their positions and policies.`,
    url: `https://fourscore.app/candidate-profile/${candidate.id}/category/${category.id}`,
    openGraphType: 'article',
    keywords: [
      'candidate survey',
      candidate.name,
      category.name,
      'political candidate',
      'election',
      'policy alignment',
    ],
  });
}

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

  if (!candidate || !candidate.name) {
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fourscore.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Candidates',
        item: 'https://fourscore.app/candidates',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: candidate.name,
        item: `https://fourscore.app/candidate-profile/${candidate.id}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: category.name,
        item: `https://fourscore.app/candidate-profile/${candidate.id}/category/${category.id}`,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `https://fourscore.app/candidate-profile/${candidate.id}/category/${category.id}`,
    name: `${candidate.name} - ${category.name} - FourScore Candidate Survey`,
    description: `Explore ${candidate.name}'s answers to survey questions on ${category.name}. Learn more about their positions and policies.`,
    mainEntity: {
      '@type': 'Person',
      name: candidate.name,
      url: `https://fourscore.app/candidate-profile/${candidate.id}`,
      sameAs: [
        candidate.candidateData?.facebookProfile,
        candidate.candidateData?.twitterProfile,
        candidate.candidateData?.linkedInProfile,
      ],
      knowsAbout: category.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FourScore',
      url: 'https://fourscore.app',
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
