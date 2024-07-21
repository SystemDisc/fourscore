'use client';

import Button from '@/components/atoms/button';
import MainCard from '@/components/atoms/main-card';
import { useEffect } from 'react';

declare const gtag_report_conversion: () => void;

export default function Page() {
  useEffect(() => {
    gtag_report_conversion();
  }, []);

  return (
    <MainCard>
      <div className='grid grid-cols-1 gap-4 p-4'>
        <div className='text-center'>
          Thank you for registering!
          <br />
          Please proceed to the poll to find your candidate matches.
        </div>
        <div className='text-center'>
          <Button
            isLink
            href='/poll'
          >
            Take the poll
          </Button>
        </div>
      </div>
    </MainCard>
  );
}
