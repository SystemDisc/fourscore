'use client';

import {
  useNextPathname,
  useNextSearchParams,
  usePreviousPathname,
  usePreviousSearchParams,
} from '@/providers/route-tracking-provider';
import { parseUrlOrPath, searchParamsEqual } from '@/utils/helpers';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { AnchorHTMLAttributes, BaseSyntheticEvent, MouseEvent, PropsWithChildren, useCallback } from 'react';
import Button, { BaseButtonProps } from '../atoms/button';

interface BaseProps extends AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {
  isButton?: boolean;
  href: string;
}

interface ButtonPropsExtended extends BaseProps, BaseButtonProps {
  isButton?: true;
}

interface LinkPropsExtended extends BaseProps {
  isButton?: false;
}

type Props = LinkPropsExtended | ButtonPropsExtended;

const isHTMLAnchorElement = (t: EventTarget): t is HTMLAnchorElement => (t as HTMLAnchorElement).href !== undefined;

export default function LinkWithBackDetection(props: PropsWithChildren<Props>) {
  const { isButton = false, children, onClick, ...otherProps } = props;
  const router = useRouter();
  const previousPathname = usePreviousPathname();
  const previousSearchParams = usePreviousSearchParams();
  const nextPathname = useNextPathname();
  const nextSearchParams = useNextSearchParams();

  const checkUrl = useCallback(
    (e: BaseSyntheticEvent, newPath: string) => {
      const url = parseUrlOrPath(newPath);
      if (previousPathname === url.pathname && searchParamsEqual(previousSearchParams, url.searchParams)) {
        router.back();
        e.preventDefault();
        return true;
      } else if (nextPathname === url.pathname && searchParamsEqual(nextSearchParams, url.searchParams)) {
        router.forward();
        e.preventDefault();
        return true;
      }
      return false;
    },
    [previousPathname, previousSearchParams, router],
  );

  const clickHandler = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (isHTMLAnchorElement(e.currentTarget)) {
        checkUrl(e, e.currentTarget.href);
      }
      return onClick?.(e);
    },
    [checkUrl, onClick],
  );

  return isButton ? (
    <Button
      isLink
      onClick={clickHandler}
      {...otherProps}
    >
      {children}
    </Button>
  ) : (
    <Link
      onClick={clickHandler}
      {...otherProps}
    >
      {children}
    </Link>
  );
}
