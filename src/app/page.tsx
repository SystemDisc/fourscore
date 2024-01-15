import LocationForm from '@/components/molecules/location-form';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div>
        <header className='p-4 min-h-screen bg-[url("/images/home/bg.png")] bg-cover bg-right-bottom'>
          <nav className="grid grid-cols-2 h-11">
            <div className="flex justify-start items-center">
              <Link href="/">
                <Image src="/images/home/logo.svg" width={170} height={37} alt='FourScore' />
              </Link>
            </div>
            <div className="flex justify-end items-center">
              <Link href="/signin" className="inline-flex justify-center items-center px-4 py-2 border border-black rounded-full tracking-widest">
                Sign in
              </Link>
            </div>
          </nav>
          <LocationForm />
        </header>
        <section className='mt-12 p-4'>
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
        <section className='mt-16 md:ml-8 p-4 mb-20'>
          <h2 className='text-6xl font-light tracking-wide mb-8'>
            We believe in the power <br className='hidden md:inline-block' />
            of people and communities
          </h2>
          <p className='text-3xl tracking-wide text-[#9b9b9b]'>
            FourScore is a non-partisan website that empowers <br className='hidden md:inline-block' />
            communities by matching voters with candidates <br className='hidden md:inline-block' />
            and connecting candidates with their community.
          </p>
        </section>
        <section className='bg-[#d8d8d8] pt-24 pb-24 mb-9'>
          <div className='max-w-4xl mx-auto'>
            <div className='float-left pr-8'>
              <Image src="/images/home/phone-preview.png" width={306} height={585} alt='App Preview' />
            </div>
            <div className="text-3xl font-light flex items-center justify-start content-center flex-wrap h-[585px]">
              <p className='w-full mb-16'>
                When you have a list of candidates and a FourScore next to each name, picking who you’re going to vote for is easy.
              </p>
              <p className='w-full mb-16'>
                No more wasted time searching endlessly for candidates online.
              </p>
              <h2 className='w-full text-6xl'>
                No more guessing.
              </h2>
            </div>
            <div className="clear-both"></div>
          </div>
        </section>
        <section className='relative text-6xl text-white'>
          <div className="flex md:w-[calc(100%_-_200px_*_5)] items-center justify-center md:justify-end bg-[#d3f2e0] h-24 px-4 mb-9">Schools</div>
          <div className="flex md:w-[calc(100%_-_200px_*_4)] items-center justify-center md:justify-end bg-[#a7e6c1] h-24 px-4 mb-9">Jobs</div>
          <div className="flex md:w-[calc(100%_-_200px_*_3)] items-center justify-center md:justify-end bg-[#7ad9a2] h-24 px-4 mb-9">Taxes</div>
          <div className="flex md:w-[calc(100%_-_200px_*_2)] items-center justify-center md:justify-end bg-[#4ecd83] h-24 px-4 mb-9">Crime</div>
          <div className="flex md:w-[calc(100%_-_200px_*_1)] items-center justify-center md:justify-end bg-[#22c064] h-24 px-4 mb-9">Traffic</div>
          <div className="md:absolute md:top-0 md:right-12 text-right text-black md:max-w-2xl md:w-full font-light mb-9">
            Tell your representatives exactly what they should be focused on
          </div>
        </section>
        <section className='min-h-screen bg-[#d8d8d8] md:flex items-center justify-center py-24 px-4 md:px-24 hidden mb-9'>
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
        <section className='bg-[#d8d8d8] md:hidden items-center justify-center py-24 px-8 md:px-24 flex mb-9'>
          <ul className='list-disc list-inside text-4xl'>
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
        <footer className='md:max-w-md md:w-full md:mx-auto text-center'>
          <div className='text-center mb-2'>
            <Image className='inline-block' src="/images/home/footer.svg" width={332} height={60} alt='FourScore' />
          </div>
          <div className="md:grid md:grid-cols-3">
            <div className="col-xs-4 text-center disabledwrap-block">
              <Link className='underline' href="/">FAQ</Link>
            </div>
            <div className="col-xs-4 text-center">
              <a className='underline' href="https://termsfeed.com/terms-conditions/e7eab208e5f8b9bae50e83ec13ad576b" target="_blank" rel="noopener noreferrer">Terms of Use</a>
            </div>
            <div className="col-xs-4 text-center">
              <a className='underline' href="https://termsfeed.com/privacy-policy/c4010971066e30d539b5d9103287de96" target="_blank" rel="noopener noreferrer">Privacy</a>
            </div>
            <div className="col-xs-12 text-center contact md:col-span-3">
              <Link className="text-uppercase underline" href='/contact-us'>Contact</Link>
            </div>
          </div>
          <small className="copyright">&copy; All Rights Reserved FourScore Tech Inc. <span>2024</span></small>
        </footer>
      </div>
    </>
  );
}
