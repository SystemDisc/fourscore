import Image from 'next/image';

export default function Loading() {
  return (
    <div className='flex justify-center items-center'>
      <Image
        src='/images/loading.svg'
        alt='Loading...'
      />
    </div>
  );
}
