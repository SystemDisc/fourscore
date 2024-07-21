// AccordionItem.jsx
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Star from '@/components/atoms/star';
import { calculateRateFromScore } from '@/utils/calc';

const AnswerItem = ({
  title,
  score,
  categoryId,
}: {
  title: string | null;
  score: number | null;
  categoryId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const goCategoryPage = () => {
    router.push(`${pathname}/${categoryId}`);
  };

  return (
    <div
      className='border mb-2 rounded-md shadow'
      onClick={goCategoryPage}
    >
      <div className='w-full text-left px-6 py-4 hover:bg-gray-200 focus:outline-none'>
        <div className='flex flex-row justify-between items-center'>
          <div>
            <div className='text-2xl font-light'>{title}</div>
            <div className='flex flex-row gap-2 items-center'>
              <div className='text-lg font-light'>{Math.round(score || 0)}% Similar</div>
              <Star rate={calculateRateFromScore(score)} />
            </div>
          </div>
          <div>
            <svg
              width='22'
              height='35'
              viewBox='0 0 22 35'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <mask
                id='mask0_0_2061'
                style={{ maskType: 'luminance' }}
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='22'
                height='34'
              >
                <rect
                  width='33.0912'
                  height='21'
                  transform='matrix(0 1 1 0 0.334473 0.5)'
                  fill='white'
                />
              </mask>
              <g mask='url(#mask0_0_2061)'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2.76405 5.92669C1.983 5.14564 1.983 3.87931 2.76404 3.09826L3.94256 1.91975C4.72361 1.1387 5.98993 1.1387 6.77098 1.91975L18.688 13.8367C18.7331 13.8746 18.777 13.9147 18.8195 13.9572L19.998 15.1357C20.1206 15.2583 20.224 15.393 20.3082 15.5358C20.7788 16.3059 20.6809 17.3254 20.0146 17.9918L18.8361 19.1703C18.7505 19.2558 18.6592 19.332 18.5633 19.3988L6.75438 31.2077C5.97333 31.9888 4.707 31.9888 3.92595 31.2077L2.74744 30.0292C1.96639 29.2481 1.96639 27.9818 2.74744 27.2008L13.3928 16.5554L2.76405 5.92669Z'
                  fill='#C6C9CF'
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
