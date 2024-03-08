import ChevronDown from '@/components/atoms/chevron-down';
import Accordion from '@/components/molecules/accordion';
import AuthButton from '@/components/molecules/auth-button';
import LocationForm from '@/components/molecules/location-form';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div>
        <header className='p-4 min-h-[100dvh] bg-[url("/images/home/bg.png")] bg-cover bg-right-bottom'>
          <nav className="grid grid-cols-2 h-11">
            <div className="flex justify-start items-center">
              <Link href="/">
                <Image src="/images/home/logo.svg" width={170} height={37} alt='FourScore' />
              </Link>
            </div>
            <div className="flex justify-end items-center">
              <AuthButton />
            </div>
          </nav>
          <LocationForm />
          <ChevronDown htmlFor='3-steps' />
        </header>
        <section className='pt-12 p-4 bg-white' id='3-steps'>
          <div className="grid grid-cols-3 max-w-2xl mx-auto text-center text-xl tracking-widest text-[#9b9b9b]">
            <div className='col-span-3 lg:col-span-1 mb-4'>
              <div className='mb-2'>
                <Image className='inline-block' src="/images/home/address-icon.svg" width={100} height={100} alt='Address' />
              </div>
              <div>
                Enter the address where you&apos;re registered to vote
              </div>
            </div>
            <div className='col-span-3 lg:col-span-1 mb-4'>
              <div className='mb-2'>
                <Image className='inline-block' src="/images/home/survey-icon.svg" width={100} height={100} alt='Survey' />
              </div>
              <div>
                Take the Local, State, and Federal poll
              </div>
            </div>
            <div className='col-span-3 lg:col-span-1 mb-4'>
              <div className='mb-2'>
                <Image className='inline-block' src="/images/home/selection-icon.svg" width={100} height={100} alt='Favorite' />
              </div>
              <div>
                Select your perfect candidates and love your vote
              </div>
            </div>
          </div>
        </section>
        <section className='pt-16 lg:pl-8 pb-20 lg:grid-cols-2 bg-white'>
          <div className='p-4'>
            <h2 className='text-6xl font-light tracking-wide mb-8'>
              We believe in the power <br className='hidden lg:inline-block' />
              of people and communities
            </h2>
            <p className='text-3xl tracking-wide text-[#9b9b9b]'>
              FourScore seamlessly connects voters with candidates <br className='hidden lg:inline-block' />
              through policy-based matching, making every vote <br className='hidden lg:inline-block' />
              more informed and impactful.
            </p>
          </div>
        </section>
        <section className='from-[#9EA1A5] to-[#393C40] bg-gradient-to-b text-white pt-24 pb-36'>
          <div className='max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 px-4'>
            <div>
              <Image src="/images/home/phone-preview.png" width={839} height={1106} alt='App Preview' />
            </div>
            <div className="text-3xl font-light flex items-center justify-start content-center flex-wrap h-[585px]">
              <p className='w-full mb-16'>
                When you have a list of candidates and a FourScore next to each name, picking who you&apos;re going to vote for is easy.
              </p>
              <p className='w-full mb-16'>
                No more wasted time searching endlessly for candidates online.
              </p>
              <h2 className='w-full text-6xl'>
                No more guessing.
              </h2>
            </div>
          </div>
          <div className='max-h-fit lg:columns-3 lg:col-span-2 gap-4 mx-4 lg:mx-16 [&>*:not(:last-child)]:mb-4'>
            <Accordion isOpen header='What is FourScore?' className='grid grid-cols-1 gap-4' wrapperClassname='break-inside-avoid-column break-after-column'>
              <p>FourScore is a non-partisian, online tool built to help voters: </p>
              <ul className='list-disc list-inside grid grid-cols-1 gap-4 mb-4'>
                <li>
                  Quickly and easily pick the candidates on their ballot who align with their most important issues
                </li>
                <li>
                  Drive policy decisions in their community, state and nation by sending poll results to the official&apos;s public opinion dashboard
                </li>
              </ul>
              <p>FourScore also helps elected officials and candidates running for office to better represent their community by: </p>
              <ul className='list-disc list-inside grid grid-cols-1 gap-4'>
                <li>
                  Saving them money by eliminating the need to hire teams of consultants and marketing professionals
                </li>
                <li>
                  Providing them premium data and insight into their community on the issues the community has said are most important
                </li>
                <li>
                  Giving them the ability to connect directly with individual voters, without the voter having to expose who they are or their personal contact info
                </li>
              </ul>
            </Accordion>
            <Accordion isOpen header='As a voter, are my candidate selections, my answers, and my info kept private?' className='grid grid-cols-1 gap-4' wrapperClassname='break-inside-avoid-column'>
              <p>Yes.</p>
              <p>We are not in the business of selling yours, or anyone&apos;s personal data.</p>
            </Accordion>
            <Accordion isOpen header='What party or political organization is FourScore affiliated with?' className='grid grid-cols-1 gap-4' wrapperClassname='break-inside-avoid-column break-after-column'>
              <p>None.</p>
              <p>FourScore is totally independent and non-partisian. We are not affiliated with any political party or political organization of any kind.  We serve to empower communities and the voters within those communities.</p>
              <p>Any candidate, elected official, or voter is welcome to utilize the many benefits of FourScore.</p>
            </Accordion>
            <Accordion isOpen header='How does FourScore make money?' className='grid grid-cols-1 gap-4' wrapperClassname='break-inside-avoid-column'>
              <p>FourScore makes money by charging elected officials and candidates for real-time public opinion about their community&apos;s greatest concerns, and connecting them with their voters.</p>
            </Accordion>
            <Accordion isOpen header='What does it cost to use FourScore?' className='grid grid-cols-1 gap-4' wrapperClassname='break-inside-avoid-column'>
              <p>Nothing, nada, zero, zilch.</p>
              <p>FourScore is FREE forever for voters.</p>
              <p>FourScore makes money by charging elected officials and candidates for real-time insight on the public opinion within their community, and connecting them with their voters.</p>
            </Accordion>
          </div>
        </section>
        <section className='relative text-6xl text-white bg-white py-9'>
          <div className="flex lg:w-[calc(100%_-_150px_*_5)] items-center justify-center lg:justify-end bg-[#d3f2e0] h-24 px-4 mb-9">Schools</div>
          <div className="flex lg:w-[calc(100%_-_150px_*_4)] items-center justify-center lg:justify-end bg-[#a7e6c1] h-24 px-4 mb-9">Jobs</div>
          <div className="flex lg:w-[calc(100%_-_150px_*_3)] items-center justify-center lg:justify-end bg-[#7ad9a2] h-24 px-4 mb-9">Taxes</div>
          <div className="flex lg:w-[calc(100%_-_150px_*_2)] items-center justify-center lg:justify-end bg-[#4ecd83] h-24 px-4 mb-9">Crime</div>
          <div className="flex lg:w-[calc(100%_-_150px_*_1)] items-center justify-center lg:justify-end bg-[#22c064] h-24 px-4 mb-9 lg:mb-0">Traffic</div>
          <div className="lg:max-w-[552px] text-5xl lg:absolute lg:top-9 lg:right-12 p-4 lg:p-0 text-center lg:text-right text-black lg:w-full font-light">
            Tell your representatives exactly what they should be focused on
          </div>
        </section>
        <section className='min-h-screen from-[#9EA1A5] to-[#393C40] bg-gradient-to-b text-white lg:flex items-center justify-center py-24 px-4 lg:px-24 hidden'>
          <div className='grid grid-cols-2 text-4xl font-light'>
            <p className="pr-[153px]">
              The Voter takes the poll and generates anonymous
              data about the community for their Representatives
            </p>
            <p className="pl-[153px]">
              The Representatives develop plans to address the
              most important issues facing their community
            </p>
            <div className='flex items-center justify-center w-[242px] h-[273px] mx-auto -my-8 col-span-2'>
              <Image src="/images/home/circle-of-voter.svg" width={242} height={273} alt='Diagram' />
            </div>
            <p className="pr-[153px]">
              The Voter rewards their Representative with another vote
            </p>
            <p className="pl-[153px]">
              The Representative continues to reach out to Voters
              to get their feedback about the community
            </p>
          </div>
        </section>
        <section className='from-[#9EA1A5] to-[#393C40] bg-gradient-to-b text-white lg:hidden items-center justify-center py-24 px-8 lg:px-24 flex'>
          <ul className='list-disc list-inside text-2xl'>
            <li className='mb-4'>
              The Voter takes the poll and generates anonymous
              data about the community for their Representatives
            </li>
            <li className='mb-4'>
              The Representatives develop plans to address the
              most important issues facing their community
            </li>
            <li className='mb-4'>
              The Voter rewards their Representative with another vote
            </li>
            <li>
              The Representative continues to reach out to Voters
              to get their feedback about the community
            </li>
          </ul>
        </section>
        <footer className='text-center bg-[#212224] py-16 text-white'>
          <div className='lg:max-w-md lg:w-full lg:mx-auto'>
            <div className='text-center mb-2'>
              <Image className='inline-block' src="/images/home/footer.svg" width={332} height={60} alt='FourScore' />
            </div>
            <div className="lg:grid lg:grid-cols-3">
              <div className="col-xs-4 text-center disabledwrap-block">
                <Link className='underline' href="/">FAQ</Link>
              </div>
              <div className="col-xs-4 text-center">
                <a className='underline' href="https://termsfeed.com/terms-conditions/e7eab208e5f8b9bae50e83ec13ad576b" target="_blank" rel="noopener noreferrer">Terms of Use</a>
              </div>
              <div className="col-xs-4 text-center">
                <a className='underline' href="https://termsfeed.com/privacy-policy/c4010971066e30d539b5d9103287de96" target="_blank" rel="noopener noreferrer">Privacy</a>
              </div>
              <div className="col-xs-12 text-center contact lg:col-span-3">
                <Link className="text-uppercase underline" href='/contact-us'>Contact</Link>
              </div>
            </div>
            <small className="copyright">&copy; All Rights Reserved FourScore Tech Inc. <span>2024</span></small>
          </div>
        </footer>
      </div>
    </>
  );
}
