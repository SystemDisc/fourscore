import ExternalFooter from '@/components/molecules/external-footer';
import ExternalNav from '@/components/molecules/external-nav';
import { generateCommonMetadata } from '@/utils/helpers';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: 'Terms and Conditions',
    description: "Read the terms and conditions for using FourScore's services.",
    url: 'https://fourscore.app/terms',
    openGraphType: 'website',
    keywords: ['terms and conditions', 'FourScore', 'user agreement'],
  });
}

export default function TermsPage() {
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
        name: 'Terms and Conditions',
        item: 'https://fourscore.app/terms',
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://fourscore.app/terms',
    name: 'Terms and Conditions',
    description: "Read the terms and conditions for using FourScore's services.",
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://fourscore.app/terms',
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
        buttonType='default'
        transparent={false}
      />
      <div className='bg-white text-gray-800 min-h-screen'>
        <div className='container mx-auto px-4 py-12'>
          <h1 className='text-4xl font-bold mb-8 text-center'>Terms and Conditions</h1>
          <p className='mb-4'>Last updated: August 5, 2024</p>
          <p className='mb-4'>
            These Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) govern your relationship
            with the{' '}
            <Link
              href='/'
              className='text-blue-500 hover:underline'
            >
              www.fourscore.app
            </Link>{' '}
            website (the &quot;Service&quot;) operated by ZornCo (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p className='mb-4'>Please read these Terms and Conditions carefully before using the Service.</p>
          <p className='mb-4'>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
          <p className='mb-4'>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the
            terms then you may not access the Service.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Purchases</h2>
          <p className='mb-4'>
            If you wish to purchase any product or service made available through the Service (&quot;Purchase&quot;),
            you may be asked to supply certain information relevant to your Purchase including, without limitation, your
            credit card number, the expiration date of your credit card, your billing address, and your shipping
            information.
          </p>
          <p className='mb-4'>
            You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment
            method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct
            and complete.
          </p>
          <p className='mb-4'>
            By submitting such information, you grant us the right to provide the information to third parties for
            purposes of facilitating the completion of Purchases.
          </p>
          <p className='mb-4'>
            We reserve the right to refuse or cancel your order at any time for certain reasons including but not
            limited to: product or service availability, errors in the description or price of the product or service,
            error in your order or other reasons.
          </p>
          <p className='mb-4'>
            We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is
            suspected.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Availability, Errors and Inaccuracies</h2>
          <p className='mb-4'>
            We are constantly updating our offerings of products and services on the Service. The products or services
            available on our Service may be mispriced, described inaccurately, or unavailable, and we may experience
            delays in updating information on the Service and in our advertising on other web sites.
          </p>
          <p className='mb-4'>
            We cannot and do not guarantee the accuracy or completeness of any information, including prices, product
            images, specifications, availability, and services. We reserve the right to change or update information and
            to correct errors, inaccuracies, or omissions at any time without prior notice.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Contests, Sweepstakes and Promotions</h2>
          <p className='mb-4'>
            Any contests, sweepstakes or other promotions (collectively, &quot;Promotions&quot;) made available through
            the Service may be governed by rules that are separate from these Terms. If you participate in any
            Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion
            conflict with these Terms, the Promotion rules will apply.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Content</h2>
          <p className='mb-4'>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post
            to the Service, including its legality, reliability, and appropriateness.
          </p>
          <p className='mb-4'>
            By posting Content to the Service, you grant us the right and license to use, modify, publicly perform,
            publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all
            of your rights to any Content you submit, post or display on or through the Service and you are responsible
            for protecting those rights. You agree that this license includes the right for us to make your Content
            available to other users of the Service, who may also use your Content subject to these Terms.
          </p>
          <p className='mb-4'>
            You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and
            grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or
            through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or
            any other rights of any person.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Accounts</h2>
          <p className='mb-4'>
            When you create an account with us, you must provide us information that is accurate, complete, and current
            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination
            of your account on our Service.
          </p>
          <p className='mb-4'>
            You are responsible for safeguarding the password that you use to access the Service and for any activities
            or actions under your password, whether your password is with our Service or a third-party service.
          </p>
          <p className='mb-4'>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming
            aware of any breach of security or unauthorized use of your account.
          </p>
          <p className='mb-4'>
            You may not use as a username the name of another person or entity or that is not lawfully available for
            use, a name or trade mark that is subject to any rights of another person or entity other than you without
            appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Copyright Policy</h2>
          <p className='mb-4'>
            We respect the intellectual property rights of others. It is our policy to respond to any claim that Content
            posted on the Service infringes the copyright or other intellectual property infringement
            (&quot;Infringement&quot;) of any person.
          </p>
          <p className='mb-4'>
            If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has
            been copied in a way that constitutes copyright infringement that is taking place through the Service, you
            must submit your notice in writing to the attention of &quot;Copyright Infringement&quot; of{' '}
            <a
              className='text-blue-500 hover:underline'
              href={`mailto:${encodeURI('"FourScore Support" <support@fourscore.app>')}`}
              target='_blank'
            >
              support@fourscore.app
            </a>{' '}
            and include in your notice a detailed description of the alleged Infringement.
          </p>
          <p className='mb-4'>
            You may be held accountable for damages (including costs and attorneys&apos; fees) for misrepresenting that
            any Content is infringing your copyright.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Intellectual Property</h2>
          <p className='mb-4'>
            The Service and its original content (excluding Content provided by users), features and functionality are
            and will remain the exclusive property of ZornCo and its licensors. The Service is protected by copyright,
            trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress
            may not be used in connection with any product or service without the prior written consent of ZornCo.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Links To Other Web Sites</h2>
          <p className='mb-4'>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by
            FourScore.
          </p>
          <p className='mb-4'>
            FourScore has no control over, and assumes no responsibility for, the content, privacy policies, or
            practices of any third party web sites or services. You further acknowledge and agree that FourScore shall
            not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused
            by or in connection with use of or reliance on any such content, goods or services available on or through
            any such web sites or services.
          </p>
          <p className='mb-4'>
            We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or
            services that you visit.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Termination</h2>
          <p className='mb-4'>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className='mb-4'>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
            account, you may simply discontinue using the Service.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Limitation Of Liability</h2>
          <p className='mb-4'>
            In no event shall FourScore, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access
            to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on
            the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of
            your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other
            legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy
            set forth herein is found to have failed of its essential purpose.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Disclaimer</h2>
          <p className='mb-4'>
            Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied,
            including, but not limited to, implied warranties of merchantability, fitness for a particular purpose,
            non-infringement or course of performance.
          </p>
          <p className='mb-4'>
            FourScore its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function
            uninterrupted, secure or available at any particular time or location; b) any errors or defects will be
            corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the
            Service will meet your requirements.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Governing Law</h2>
          <p className='mb-4'>
            These Terms shall be governed and construed in accordance with the laws of Colorado, United States, without
            regard to its conflict of law provisions.
          </p>
          <p className='mb-4'>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us
            regarding our Service, and supersede and replace any prior agreements we might have between us regarding the
            Service.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Changes</h2>
          <p className='mb-4'>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will try to provide at least 30 days notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion.
          </p>
          <p className='mb-4'>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
          <h2 className='text-2xl font-semibold mb-4'>Contact Us</h2>
          <p className='mb-4'>
            If you have any questions about these Terms, please contact us at{' '}
            <a
              className='text-blue-500 hover:underline'
              href={`mailto:${encodeURI('"FourScore Support" <support@fourscore.app>')}`}
              target='_blank'
            >
              support@fourscore.app
            </a>
            .
          </p>
        </div>
      </div>
      <ExternalFooter />
    </>
  );
}
