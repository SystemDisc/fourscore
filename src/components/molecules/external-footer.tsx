import Image from 'next/image';
import Link from 'next/link';
import Disclaimer from '../atoms/disclaimer';

export default function ExternalFooter() {
  return (
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
          <div className='col-xs-4 text-center'>
            <Link
              className='underline'
              href='/about'
            >
              About
            </Link>
          </div>
          <div className='col-xs-4 text-center'>
            <Link
              className='underline'
              href='/terms'
            >
              Terms of Use
            </Link>
          </div>
          <div className='col-xs-4 text-center'>
            <Link
              className='underline'
              href='/privacy-policy'
            >
              Privacy
            </Link>
          </div>
          <div className='col-xs-12 text-center'>
            <Link
              className='text-uppercase underline'
              href='/contact-us'
            >
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
  );
}
