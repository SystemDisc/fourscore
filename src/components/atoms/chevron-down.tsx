'use client';

import { BsChevronDown } from 'react-icons/bs';

export default function ChevronDown({
  htmlFor,
}: {
  htmlFor: string;
}) {
  return (
    <div className='flex justify-center items-center text-5xl text-white cursor-pointer' onClick={(e) => {
      e.preventDefault();
      document.getElementById(htmlFor)?.scrollIntoView({ behavior: 'smooth' });
    }}>
      <BsChevronDown />
    </div>
  );
}
