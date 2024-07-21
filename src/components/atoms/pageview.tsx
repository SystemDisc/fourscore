'use client';

import usePageTitle from '@/app/hooks/use-page-title';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Pageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageTitle = usePageTitle();

  useEffect(() => {
    const fullPath = `${pathname}${searchParams.size > 0 ? `?${searchParams}` : ''}`;
    window.dataLayer.push({
      event: 'pageview',
      pagePath: fullPath,
      pageTitle: pageTitle,
    } as GAPageviewEvent);
  }, [pathname, searchParams]);

  return null;
}
