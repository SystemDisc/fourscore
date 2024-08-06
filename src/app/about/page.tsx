import appImage from '@/../public/images/about/app.jpg';
import headImage from '@/../public/images/about/head.jpg';
import orgImage from '@/../public/images/about/organization.jpg';
import upcomingImage from '@/../public/images/about/upcoming.jpg';
import ExternalFooter from '@/components/molecules/external-footer';
import ExternalNav from '@/components/molecules/external-nav';
import { generateCommonMetadata } from '@/utils/helpers';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: 'About FourScore',
    description:
      'Learn more about FourScore, our mission to enhance voter engagement, and how our policy-based matching system connects voters with political candidates.',
    url: 'https://fourscore.app/about',
    openGraphType: 'website',
    keywords: ['about FourScore', 'voter engagement', 'policy alignment', 'election', 'democracy'],
  });
}

export default async function Page() {
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
        name: 'About',
        item: 'https://fourscore.app/about',
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://fourscore.app/about',
    name: 'About FourScore',
    description:
      'Learn more about FourScore, our mission to enhance voter engagement, and how our policy-based matching system connects voters with political candidates.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://fourscore.app/about',
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
      <ExternalNav
        className='border-b border-neutral-300'
        buttonType='default'
      />
      <div className='text-gray-800 min-h-screen bg-white'>
        <div className='container mx-auto p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            <div>
              <Image
                src={headImage}
                alt='About FourScore'
                className='w-full h-full object-cover rounded-lg shadow-md'
                sizes='50vw, 100vw'
              />
            </div>
            <div className='flex'>
              <div className='flex flex-col justify-start bg-gray-50 rounded-lg shadow-md w-full'>
                <header className='p-4 border-b-2 border-neutral-300 bg-neutral-100 rounded-t-lg'>
                  <h1 className='text-4xl font-bold text-center'>About FourScore</h1>
                </header>
                <section className='p-8 flex-1 flex flex-col justify-center'>
                  <h2 className='text-2xl font-semibold mb-4'>Our Mission</h2>
                  <p className='mb-4'>
                    FourScore is dedicated to enhancing voter engagement and making democracy more accessible. Our
                    policy-based matching system connects voters with political candidates, helping both parties to make
                    informed decisions and align on key issues.
                  </p>
                  <h2 className='text-2xl font-semibold mb-4'>How It Works</h2>
                  <p>
                    Our comprehensive survey covers local, state, and federal policies. By analyzing responses, we
                    create a personalized &apos;Four Score&apos; that reflects alignment between voters and candidates.
                    This innovative approach ensures more informed decisions at the ballot box and more effective
                    engagement for candidates.
                  </p>
                </section>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            <div className='order-2 md:order-1 flex'>
              <div className='flex flex-col justify-center bg-green-50 p-8 rounded-lg shadow-md w-full'>
                <h2 className='text-3xl font-bold mb-4 text-center md:text-left'>About FourScore the Organization</h2>
                <p className='mb-4'>
                  FourScore aims to foster a more engaged and informed electorate. By providing tools that help voters
                  and candidates understand each other&apos;s positions, we strive to create a more transparent and
                  accountable political system.
                </p>
                <p className='mb-4'>
                  Our team consists of dedicated professionals from diverse backgrounds, including political science,
                  technology, and community advocacy. We work tirelessly to develop innovative solutions that bridge the
                  gap between voters and candidates, ensuring that every voice is heard and every vote counts.
                </p>
                <p className='mb-4'>
                  We partner with various civic organizations, educational institutions, and technology platforms to
                  expand our reach and impact. By leveraging these partnerships, we aim to provide comprehensive
                  resources and support to both voters and candidates, empowering them to participate actively in the
                  democratic process.
                </p>
              </div>
            </div>
            <div className='order-1 md:order-2'>
              <Image
                src={orgImage}
                alt='FourScore Organization'
                className='w-full h-full object-cover rounded-lg shadow-md'
                sizes='50vw, 100vw'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            <div>
              <Image
                src={appImage}
                alt='FourScore App'
                className='w-full h-full object-cover rounded-lg shadow-md'
                sizes='50vw, 100vw'
              />
            </div>
            <div className='flex'>
              <div className='flex flex-col justify-center bg-gray-50 p-8 rounded-lg shadow-md w-full'>
                <h2 className='text-3xl font-bold mb-4 text-center md:text-left'>About FourScore the App</h2>
                <p className='mb-4'>
                  The FourScore app is designed to simplify the voting process for both voters and candidates. Through
                  our user-friendly interface, voters can easily navigate the survey and provide their stances on
                  various policy issues. This information is then matched with candidates&apos; responses, generating a
                  &apos;Four Score&apos; that highlights the level of alignment between them.
                </p>
                <div className='text-center'>
                  <Link
                    href='/poll'
                    className='inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200'
                  >
                    Take the Survey
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='order-2 md:order-1 flex'>
              <div className='flex flex-col justify-center bg-blue-50 p-8 rounded-lg shadow-md w-full'>
                <h2 className='text-3xl font-bold mb-4 text-center md:text-left'>Upcoming Features</h2>
                <p className='mb-4'>
                  We are continuously working to improve the FourScore app and introduce new features that enhance the
                  experience for both voters and candidates. Here are some of the exciting updates we have planned:
                </p>
                <p className='mb-4'>
                  We will introduce features for candidates to create detailed profiles, complete surveys, and engage
                  directly with voters. Our upcoming analytics tools will provide candidates with valuable insights into
                  voter preferences, helping them tailor their campaigns to better address the needs and concerns of
                  their constituents.
                </p>
                <p className='mb-4'>
                  Future updates will also include a wealth of educational resources, such as articles, videos, and
                  interactive tools that help users stay informed about key issues and the electoral process. Whether
                  you&apos;re a voter looking to make an informed decision or a candidate seeking to connect with your
                  community, the FourScore app will be your go-to resource for all things election-related.
                </p>
                <ul className='list-disc pl-6'>
                  <li className='mb-2'>
                    Enhanced voter-candidate matching algorithms to provide more accurate and personalized &apos;Four
                    Scores&apos;.
                  </li>
                  <li className='mb-2'>
                    New interactive tools for candidates to engage with voters and gather feedback on their campaigns.
                  </li>
                  <li className='mb-2'>
                    Additional educational content to help users understand complex policy issues and the electoral
                    process.
                  </li>
                  <li className='mb-2'>
                    Integration with social media platforms to allow candidates and voters to share their &apos;Four
                    Scores&apos; and engage with their networks.
                  </li>
                  <li className='mb-2'>
                    Improved user interface and navigation to make the app more intuitive and user-friendly.
                  </li>
                </ul>
              </div>
            </div>
            <div className='order-1 md:order-2'>
              <Image
                src={upcomingImage}
                alt='Upcoming Features'
                className='w-full h-full object-cover rounded-lg shadow-md'
                sizes='50vw, 100vw'
              />
            </div>
          </div>
        </div>
      </div>
      <ExternalFooter />
    </>
  );
}
