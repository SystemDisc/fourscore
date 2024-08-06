import Disclaimer from '@/components/atoms/disclaimer';
import MainCard from '@/components/atoms/main-card';
import AuthButton from '@/components/molecules/auth-button';
import CandidateList from '@/components/molecules/candidate-list';
import LinkWithBackDetection from '@/components/molecules/link-with-back-detection';
import MainNav from '@/components/molecules/main-nav';
import { CandidateResult } from '@/types';
import authOptions from '@/utils/auth-options';
import { generateCommonMetadata } from '@/utils/helpers';
import { generateCandidateJsonLd } from '@/utils/helpers/json-ld';
import { renderMarkdown } from '@/utils/markdown';
import { getCandidates, getPoll } from '@/utils/server-actions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: 'FourScore - Candidates',
    description:
      'Enhance your political campaign by connecting with voters through FourScore. Our platform helps you align your policies with voter preferences, increasing your chances of electoral success. Join FourScore to make informed connections and engage more effectively with your supporters.',
    url: 'https://fourscore.app/candidates',
    openGraphType: 'website',
    keywords: ['political candidates', 'elections', 'voter engagement', 'FourScore', 'policy alignment'],
  });
}

export default async function Page() {
  const candidates = await getCandidates();
  const candidateJsonLd = generateCandidateJsonLd(candidates);

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
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: 'https://fourscore.app/candidates',
    name: 'List of Political Candidates',
    itemListElement: candidates.map((candidate, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: candidate.name,
        description: candidate.candidateData?.description,
        birthDate: candidate.candidateData?.birthDate,
        birthPlace: candidate.candidateData?.birthPlace,
        alumniOf: candidate.candidateData?.education,
        memberOf: candidate.candidateData?.partyAffiliation,
        sameAs: [
          candidate.candidateData?.facebookProfile,
          candidate.candidateData?.twitterProfile,
          candidate.candidateData?.linkedInProfile,
        ],
        url: candidate.candidateData?.websiteUrl,
        worksFor: {
          '@type': 'Organization',
          name: candidate.candidateData?.partyAffiliation,
        },
        knowsAbout: candidate.candidateData?.issues,
        hasOccupation: candidate.candidateData?.previousPositions?.map((position) => ({
          '@type': 'Occupation',
          name: position,
        })),
      },
    })),
    potentialAction: candidateJsonLd,
    publisher: {
      '@type': 'Organization',
      name: 'FourScore',
    },
  };

  const session = await getServerSession(authOptions);

  if (session?.user) {
    const data = await getPoll(session?.user);
    if (data.allAnswers.length > 0) {
      redirect('/candidate-matches');
    } else {
      redirect('/poll');
    }
  }

  const renderedCandidates = await candidates.reduce(
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
      <MainCard>
        <section className='flex flex-col bg-gradient-to-tr from-[#22C064] to-[#69F7A5]'>
          <MainNav loggedIn={!!session?.user} />
          <header className='w-full p-4 text-white'>
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
              candidates={renderedCandidates}
              withoutPledging
            />
          </div>
        </section>
        <section className='p-4 pt-0'>
          <div className='flex justify-center'>
            {session?.user ? (
              <LinkWithBackDetection
                isButton
                href='/dashboard'
              >
                Go to Dashboard
              </LinkWithBackDetection>
            ) : (
              <AuthButton buttonType='default' />
            )}
          </div>
        </section>
        <Disclaimer className='text-justify text-sm p-4 bg-neutral-100 border-t border-neutral-300' />
      </MainCard>
    </>
  );
}
