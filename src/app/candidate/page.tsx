import Button from '@/components/atoms/button';
import ChevronDown from '@/components/atoms/chevron-down';
import Disclaimer from '@/components/atoms/disclaimer';
import Accordion from '@/components/molecules/accordion';
import AuthButton from '@/components/molecules/auth-button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='h-full'>
        <header className='p-4 min-h-[100dvh] bg-[url("/images/home/candidate-bg.png")] bg-cover [background-position:bottom_center]'>
          <nav className='h-11 flex justify-between items-center gap-4'>
            <Link href='/'>
              <Image
                className='max-w-[calc(50vw_-_1.5rem)] relative top-[2px]'
                src='/images/home/logo.svg'
                width={170}
                height={37}
                alt='FourScore'
              />
            </Link>
            <AuthButton isCandidate />
          </nav>
          <div className='min-h-[calc(100dvh_-_2.75rem_-_2rem_-_3rem)] flex items-center md:justify-start content-center flex-wrap md:pl-20 p-0 justify-center text-white'>
            <div className='md:w-full text-7xl font-black mb-4'>
              <div className='max-w-xl w-full text-center text-stroke'>
                Connected
              </div>
            </div>
            <div className='md:w-full text-2xl'>
              <div className='max-w-xl w-full text-center text-stroke mb-4 font-bold'>
                Save money and start connecting with your voters today
              </div>
              <div className='max-w-xl w-full text-center mb-4'>
                <Button
                  className='!tracking-wide rounded-tl-md rounded-br-md h-14 !px-8 [border-bottom-left-radius:1.75rem] [border-top-right-radius:1.75rem]'
                  isLink
                  href='/candidate'
                >
                  Get Started
                </Button>
              </div>
              <div className='max-w-xl w-full text-center text-xl font-bold'>
                <Button isLink buttonType='white' href='/'>
                  I&apos;m a voter
                </Button>
              </div>
            </div>
          </div>
          <ChevronDown htmlFor='how-it-works' />
        </header>
        <section
          className='from-[#9EA1A5] to-[#393C40] bg-gradient-to-b text-white pt-12 pb-24'
          id='how-it-works'
        >
          <div className='max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-8 px-4'>
            <div className='flex items-center justify-center'>
              <Image
                src='/images/home/phone-preview.png'
                width={839}
                height={1106}
                alt='App Preview'
              />
            </div>
            <div className='text-3xl font-light flex items-center justify-start content-center flex-wrap'>
              <h2 className='text-4xl mb-16 font-bold'>How It Works</h2>
              <p className='w-full mb-16'>
                You and the voter each take the same FourScore poll.
              </p>
              <p className='w-full mb-16'>
                When the voter completes their poll, they are shown all the
                candidates on their ballot and a FourScore rating next to each
                name. The FourScore rating ranges from 0% to 100% and is based
                on how similar your poll is with the voters&apos;.
              </p>
              <p className='w-full mb-16'>
                You promote your candidacy by connecting with supporters,
                non-supporters, and undecided voters on the issues that are most
                important to them.
              </p>
              <p className='w-full mb-16'>
                When it comes time to vote, voters pick their favorite
                candidates, and FourScore sends them a list of their selections.
                The voters take their list to the polls to reference when they
                cast their ballot.
              </p>
            </div>
            <div className='text-3xl font-light flex items-center justify-start content-center flex-wrap'>
              <h2 className='text-4xl mb-16 font-bold'>
                Meaningful Engagement
              </h2>
              <p className='w-full mb-16'>
                When you use FourScore to engage your community, you&apos;re
                doing so with the ability to send voters a specific message
                based on the issues they have identified as most important to
                them.
              </p>
              <p className='w-full mb-16 md:mb-0'>
                Here is an example of a FourScore email, sent to undecided
                voters who have identified crime as their top concern.
              </p>
            </div>
            <div className='flex items-center justify-center'>
              <Image
                src='/images/home/candidate-email.png'
                width={839}
                height={1106}
                alt='App Preview'
              />
            </div>
            <div className='text-3xl font-light flex items-center justify-start col-span-2 md:max-w-2xl md:mx-auto md:text-center'>
              <p className='w-full mb-16'>
                When you engage voters about the issues they’re focused on, you
                will convert voters into supporters at a higher rate than the
                candidate who opts to make general statements while asking for
                money.
              </p>
            </div>
            <div className='text-3xl font-light flex items-center justify-start content-center flex-wrap'>
              <h2 className='text-4xl mb-16 font-bold'>FourScore Features</h2>
            </div>
            <div className='max-h-fit md:columns-3 md:col-span-2 gap-4 mx-4 md:mx-16 [&>*:not(:last-child)]:mb-4'>
              <Accordion
                isOpen
                header='FourScore Rating'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column'
              >
                <p>
                  The FourScore rating helps voters find candidates who support
                  the same issues they support. The more you align when with a
                  voter on the issues, the higher your FourScore rating.
                </p>
              </Accordion>
              <Accordion
                isOpen
                header='Candidate Profile Page'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column break-after-column'
              >
                <p>
                  When you sign up, you can create a candidate profile page.
                  Your profile page highlights your experience, education,
                  volunteerism, and endorsements. When a voter is on the fence,
                  this is where they come to make their decision on who to
                  support.
                </p>
              </Accordion>
              <Accordion
                isOpen
                header='Community Insights'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column'
              >
                <p>
                  When voters fill out their local, state and national poll, it
                  provides valuable insight on the area you serve. This insight
                  allows you to understand your community&apos;s needs and
                  concerns better. Additionally, you&apos;ll see which of your
                  answers are most popular and least popular with your
                  community.
                </p>
              </Accordion>
              <Accordion
                isOpen
                header='Social & Website Links'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column break-after-column'
              >
                <p>
                  Easily link your social accounts and campaign website to your
                  FourScore candidate profile page.
                </p>
              </Accordion>
              <Accordion
                isOpen
                header='Custom Audiences'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column'
              >
                <p>
                  You can quickly select your target audience based on their
                  survey and send relevant messaging to that audience.
                </p>
              </Accordion>
              <Accordion
                isOpen
                header='Campaign Insights'
                className='grid grid-cols-1 gap-4'
                wrapperClassname='break-inside-avoid-column'
              >
                <p>
                  Get a quick look at how your campaign is doing. Watch as your
                  supporter numbers grow in real-time.
                </p>
              </Accordion>
            </div>
            <div className='text-3xl font-light flex items-center justify-start content-center flex-wrap md:col-span-2'>
              <h2 className='text-4xl mb-8 mt-16 font-bold'>Pricing</h2>
              <p className='mb-8'>
                Using FourScore&apos;s basic features will forever be FREE for
                Candidates and Voters.
              </p>
            </div>
            <div className='max-h-fit flex justify-center items-center flex-wrap md:col-span-2 gap-4 md:mx-16 [&>*:not(:last-child)]:mb-4'>
              <div className='max-w-3xl grid md:grid-cols-2 gap-4'>
                <Accordion
                  header='Basic'
                  className='grid grid-cols-1 gap-4'
                  headerClassname='from-[#69F7A5] to-[#22C064] bg-gradient-to-bl text-center !text-white text-4xl'
                  isOpen
                >
                  <p>Receive a FourScore rating</p>
                  <p>See how many Supporters and Pledges you have</p>
                  <p>Get matched up with active voters in your community</p>
                  <p>Customized candidate profile page</p>
                  <p>Link campaign social accounts</p>
                  <p>Link campaign website</p>
                  <p>Actionable campaign insights into your community</p>
                  <div className='text-center mt-8'>
                    <Button>FREE</Button>
                  </div>
                </Accordion>
                <Accordion
                  header='Engagement'
                  className='grid grid-cols-1 gap-4'
                  headerClassname='from-[#EEEEEE] to-[#D8D8D8] bg-gradient-to-bl text-center text-4xl'
                  isOpen
                >
                  <p>Create and save custom voter audiences</p>
                  <p>
                    Send relevant messages directly to a voter&apos;s inbox
                    using FourScore&apos;s beautiful template
                  </p>
                  <p>
                    Set a budget and pay for only those emails that are opened
                  </p>
                  <p>Email opens cost only 10¢</p>
                  <p>
                    Emails sent to voters wanting to pledge cost only $1.25 per
                    open
                  </p>
                  <div className='text-center mt-8'>
                    <Button buttonType='white'>Sign Up</Button>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
        <footer className='text-center bg-[#212224] py-16 text-white'>
          <div className='md:max-w-md md:w-full md:mx-auto'>
            <div className='text-center mb-2'>
              <Image
                className='inline-block'
                src='/images/home/footer.svg'
                width={332}
                height={60}
                alt='FourScore'
              />
            </div>
            <div className='md:grid md:grid-cols-3'>
              <div className='col-xs-4 text-center disabledwrap-block'>
                <Link className='underline' href='/'>
                  FAQ
                </Link>
              </div>
              <div className='col-xs-4 text-center'>
                <a
                  className='underline'
                  href='https://termsfeed.com/terms-conditions/e7eab208e5f8b9bae50e83ec13ad576b'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Terms of Use
                </a>
              </div>
              <div className='col-xs-4 text-center'>
                <a
                  className='underline'
                  href='https://termsfeed.com/privacy-policy/c4010971066e30d539b5d9103287de96'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Privacy
                </a>
              </div>
              <div className='col-xs-12 text-center contact md:col-span-3'>
                <Link className='text-uppercase underline' href='/contact-us'>
                  Contact
                </Link>
              </div>
            </div>
            <Disclaimer className='text-justify text-xs my-2 px-2' />
            <small className='copyright'>
              &copy; All Rights Reserved FourScore Tech Inc. <span>2024</span>
            </small>
          </div>
        </footer>
      </div>
    </>
  );
}
