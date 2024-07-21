import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useCaptureGclid() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const gclid = searchParams.get('gclid');
    if (gclid) {
      Cookies.set('gclid', gclid, { expires: 90 });
    }
  }, []);
}
