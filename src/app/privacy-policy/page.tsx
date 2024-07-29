import Link from 'next/link';

export default async function Page() {
  const className = {
    h1: 'text-bold text-3xl my-2',
    p: 'mb-4',
    ul: 'mb-4 list-disc list-inside ml-8',
    a: 'text-blue-700 underline cursor-pointer',
  };

  return (
    <main>
      <section className='p-4 bg-white'>
        <h1 className={className.h1}>Privacy Policy</h1>
        <p className={className.p}>Last updated: July 29, 2024</p>
        <p className={className.p}>
          ZornCo (
          <Link
            className={className.a}
            href='https://ZornCo.com'
            target='_blank'
            rel='noopener noreferrer nofollow'
          >
            https://ZornCo.com
          </Link>
          ) ("us", "we", or "our") operates FourScore (
          <Link
            className={className.a}
            href='/'
          >
            https://FourScore.app
          </Link>
          ) (the "Service").
        </p>
        <p className={className.p}>
          This page informs you of our policies regarding the collection, use, and disclosure of Personal Information
          when you use our Service.
        </p>
        <p className={className.p}>
          We will not use or share your information with anyone except as described in this Privacy Policy.
        </p>
        <p className={className.p}>
          We use your Personal Information for providing and improving the Service. By using the Service, you agree to
          the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy
          Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at
          FourScore (
          <Link
            className={className.a}
            href='/'
          >
            https://FourScore.app
          </Link>
          ).
        </p>
        <h2 className='text-bold text-2xl my-2'>Information Collection And Use</h2>
        <p className={className.p}>
          While using our Service, we may ask you to provide us with certain personally identifiable information that
          can be used to contact or identify you. Personally identifiable information ("Personal Information") may
          include, but is not limited to:
        </p>
        <ul className={className.ul}>
          <li>Email</li>
          <li>Name</li>
          <li>Telephone</li>
          <li>Address</li>
          <li>Others</li>
        </ul>
        <h2 className='text-bold text-2xl my-2'>Log Data</h2>
        <p className={className.p}>
          We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log
          Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser
          version, the pages of our Service that you visit, the time and date of your visit, the time spent on those
          pages and other statistics.
        </p>
        <p className={className.p}>
          In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this
          type of information in order to increase our Service's functionality. These third party service providers have
          their own privacy policies addressing how they use such information.
        </p>
        <h2 className='text-bold text-2xl my-2'>Cookies</h2>
        <p className={className.p}>
          Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are
          sent to your browser from a web site and stored on your computer's hard drive.
        </p>
        <p className={className.p}>
          We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions
          of our Service.
        </p>
        <h2 className='text-bold text-2xl my-2'>Do Not Track Disclosure</h2>
        <p className={className.p}>
          We support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform
          websites that you do not want to be tracked.
        </p>
        <p className={className.p}>
          You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.
        </p>
        <h2 className='text-bold text-2xl my-2'>Service Providers</h2>
        <p className={className.p}>
          We may employ third party companies and individuals to facilitate our Service, to provide the Service on our
          behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
        </p>
        <p className={className.p}>
          These third parties have access to your Personal Information only to perform these tasks on our behalf and are
          obligated not to disclose or use it for any other purpose.
        </p>
        <h2 className='text-bold text-2xl my-2'>Communications</h2>
        <p className={className.p}>
          We may use your Personal Information to contact you with newsletters, marketing or promotional materials and
          other information that may be of interest to you. You may opt out of receiving any, or all, of these
          communications from us by following the unsubscribe link or instructions provided in any email we send or by
          contacting us.
        </p>
        <h2 className='text-bold text-2xl my-2'>Business Transaction</h2>
        <p className={className.p}>
          If FourScore Tech Inc. is involved in a merger, acquisition or asset sale, your Personal Information may be
          transferred. We will provide notice before your Personal Information is transferred and becomes subject to a
          different Privacy Policy.
        </p>
        <h2 className='text-bold text-2xl my-2'>Security</h2>
        <p className={className.p}>
          The security of your Personal Information is important to us, but remember that no method of transmission over
          the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Information, we cannot guarantee its absolute security.
        </p>
        <h2 className='text-bold text-2xl my-2'>Links To Other Sites</h2>
        <p className={className.p}>
          Our Service may contain links to other sites that are not operated by us. If you click on a third party link,
          you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every
          site you visit.
        </p>
        <p className={className.p}>
          We have no control over, and assume no responsibility for the content, privacy policies or practices of any
          third party sites or services.
        </p>
        <h2 className='text-bold text-2xl my-2'>Children's Privacy</h2>
        <p className={className.p}>Our Service does not address anyone under the age of 13 ("Children").</p>
        <p className={className.p}>
          We do not knowingly collect personally identifiable information from children under 13. If you are a parent or
          guardian and you are aware that your Children has provided us with Personal Information, please contact us. If
          we become aware that we have collected Personal Information from a child under age 13 without verification of
          parental consent, we take steps to remove that information from our servers.
        </p>
        <h2 className='text-bold text-2xl my-2'>Changes To This Privacy Policy</h2>
        <p className={className.p}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>
        <p className={className.p}>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are
          effective when they are posted on this page.
        </p>
        <h2 className='text-bold text-2xl my-2'>Google User Data</h2>
        <p className={className.p}>
          Our Service uses Google API Services to access certain user data. Specifically, we use the data to enhance
          your experience with personalized content and to improve our Service functionality. The way we access, use,
          store, and share Google user data is limited to what is described in this Privacy Policy.
        </p>
        <p className={className.p}>We collect Google user data through the following methods:</p>
        <ul className={className.ul}>
          <li>
            Google OAuth: We use Google OAuth to authenticate users and access basic profile information such as your
            email address and name. This data is used to streamline the login process and provide a personalized
            experience.
          </li>
          <li>
            Google Analytics: We use Google Analytics to collect data about how users interact with our Service. This
            helps us understand user behavior and improve our Service. The data collected includes, but is not limited
            to, page views, session duration, and other usage statistics.
          </li>
        </ul>
        <p className={className.p}>
          The data collected from Google API Services is stored securely and is not shared with third parties except as
          required to provide and improve our Service. We do not sell Google user data to any third parties.
        </p>
        <p className={className.p}>
          Users can revoke access to their Google data at any time by adjusting their Google account settings. If you
          revoke access, you may not be able to use certain features of our Service that rely on Google data.
        </p>
        <p className={className.p}>
          If you have any questions about how we handle Google user data, please contact us at{' '}
          <a
            className={className.a}
            href={`mailto:${encodeURI('"FourScore Support" <support@FourScore.app>')}`}
            target='_blank'
          >
            support@fourscore.app
          </a>
          .
        </p>
        <h2 className='text-bold text-2xl my-2'>Contact Us</h2>
        <p className={className.p}>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p className={className.p}>
          <a
            className={className.a}
            href={`mailto:${encodeURI('"FourScore Support" <support@FourScore.app>')}`}
            target='_blank'
          >
            support@fourscore.app
          </a>
        </p>
      </section>
    </main>
  );
}
