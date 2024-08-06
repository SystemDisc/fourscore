import MainCard from '@/components/atoms/main-card';
import AuthButton from '@/components/molecules/auth-button';
import { generateCommonMetadata } from '@/utils/helpers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: 'Account Needed - FourScore',
    description:
      'Register or sign in to save your poll responses and get matched with candidates that align with your values and policy preferences on FourScore.',
    url: 'https://fourscore.app/account-needed',
    openGraphType: 'website',
    keywords: ['account needed', 'register', 'sign in', 'candidate matching', 'FourScore'],
  });
}

export default function AccountNeededPage() {
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
        name: 'Account Needed',
        item: 'https://fourscore.app/account-needed',
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://fourscore.app/account-needed',
    name: 'Account Needed - FourScore',
    description:
      'Register or sign in to save your poll responses and get matched with candidates that align with your values and policy preferences on FourScore.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://fourscore.app/account-needed',
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
        <div className='text-center p-4'>
          <h1 className='text-4xl font-bold mb-4'>Register or Sign In</h1>
          <p className='mb-4'>
            Join FourScore to save your poll responses and get matched with candidates who share your values and policy
            preferences. Our advanced matching algorithm analyzes your responses to connect you with the best candidates
            for you.
          </p>
          <p className='mb-4'>
            Register or sign in to access personalized candidate matches, stay informed on key issues, and participate
            more effectively in the democratic process. FourScore is free for voters and will always remain free,
            ensuring your voice is heard without any cost.
          </p>
          <AuthButton buttonType='default' />
        </div>
      </MainCard>
    </>
  );
}
