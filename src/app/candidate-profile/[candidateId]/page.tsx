import Profile from '@/components/molecules/profile/profile';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import authOptions from '@/utils/auth-options';
import { fetchBaseMetadata, generateCommonMetadata } from '@/utils/helpers';
import { generateProfileJsonLd } from '@/utils/helpers/json-ld';
import { calculateMatches, getCandidateAnswerScore, getCandidates } from '@/utils/server-actions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params: { candidateId },
}: {
  params: { candidateId: string };
}): Promise<Metadata> {
  const baseMetadata = await fetchBaseMetadata();
  const candidates = await getCandidates();
  const candidate = candidates.find((candidate) => candidate.id === candidateId);

  if (!candidate || !candidate.name) {
    return {
      ...baseMetadata,
      title: `${baseMetadata.title} - 404`,
    };
  }

  const images = candidate.candidateData?.profileImage
    ? [
        {
          url: candidate.candidateData?.profileImage,
          width: 800,
          height: 600,
          alt: candidate.name,
        },
      ]
    : [];

  return generateCommonMetadata({
    title: `${candidate.name} - FourScore Candidate Profile`,
    description: candidate.candidateData?.description || 'Learn more about this candidate.',
    url: `https://fourscore.app/candidate-profile/${candidate.id}`,
    openGraphType: 'profile',
    images,
    keywords: ['candidate profile', candidate.name, 'political candidate', 'election', 'policy alignment'],
  });
}

export default async function Page({ params: { candidateId } }: { params: { candidateId: string } }) {
  const session = await getServerSession(authOptions);

  const { candidates, currentUser } = session?.user
    ? await calculateMatches(session.user)
    : { candidates: await getCandidates(), currentUser: undefined };
  const candidate = candidates.find((candidate) => candidate.id === candidateId);

  if (!candidate) {
    notFound();
  }

  const jsonLd = generateProfileJsonLd(candidate);

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
    ],
  };

  const candidateQuestionsWithScore = currentUser && (await getCandidateAnswerScore(session?.user, candidateId));

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
      <Profile
        candidate={candidate}
        candidateQuestionsWithScore={candidateQuestionsWithScore}
      />
    </>
  );
}
