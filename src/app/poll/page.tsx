import MainCard from '@/components/atoms/main-card';
import Poll from '@/components/molecules/poll';
import authOptions from '@/utils/auth-options';
import { generateCommonMetadata } from '@/utils/helpers';
import { getPoll, getUser } from '@/utils/server-actions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: 'FourScore: Complete Your Survey',
    description:
      "Complete the FourScore survey to help us understand your positions on key issues. Your responses will create a personalized 'Four Score' that reflects your alignment with voter or candidate preferences.",
    url: 'https://fourscore.app/poll',
    openGraphType: 'website',
    keywords: ['survey', 'FourScore', 'policy alignment', 'voter engagement'],
  });
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const data = await getPoll(session?.user);
  const user = await getUser(session?.user);

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
        name: 'Survey',
        item: 'https://fourscore.app/poll',
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://fourscore.app/poll',
    name: 'FourScore: Complete Your Survey',
    description:
      "Complete the FourScore survey to help us understand your positions on key issues. Your responses will create a personalized 'Four Score' that reflects your alignment with voter or candidate preferences.",
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://fourscore.app/poll',
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
      <MainCard>
        <Poll
          questions={data.questions}
          allAnswers={data.allAnswers}
          seenVotingTutorial={user?.seenVotingTutorial}
        />
      </MainCard>
    </>
  );
}
