import { ParsedUrl } from '@/types';

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

export const parseUrlOrPath = (input?: string | null) => {
  if (input === null || input === undefined) {
    return {
      pathname: null,
      searchParams: new URLSearchParams(),
    };
  }
  try {
    const url = new URL(input);
    return {
      pathname: url.pathname,
      searchParams: url.searchParams,
    } as ParsedUrl;
  } catch {
    const [pathname, search] = input.split('?');
    return {
      pathname: pathname || '',
      searchParams: new URLSearchParams(search || ''),
    } as ParsedUrl;
  }
};

export const searchParamsEqual = (params1: URLSearchParams, params2: URLSearchParams) => {
  if (params1.toString() === params2.toString()) {
    return true;
  }

  for (const [key, value] of params1) {
    if (params2.get(key) !== value) {
      return false;
    }
  }

  for (const [key, value] of params2) {
    if (params1.get(key) !== value) {
      return false;
    }
  }

  return true;
};
