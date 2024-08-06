import { ParsedUrl } from '@/types';
import { Metadata } from 'next';

interface CommonMetadataOptions {
  title?: string;
  description?: string;
  url?: string;
  openGraphType?: string;
  images?: { url: string; width: number; height: number; alt: string }[];
  keywords?: string[];
}

export const fetchBaseMetadata = async (): Promise<Metadata> => {
  return {
    title: 'FourScore: Match Your Vote with Your Values',
    description:
      'FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized "Four Score," reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values.',
    openGraph: {
      title: 'FourScore: Match Your Vote with Your Values',
      description:
        'FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized "Four Score," reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values.',
      url: 'https://fourscore.app',
      type: 'website',
      images: [
        {
          url: 'https://fourscore.app/images/website-preview.png',
          width: 1200,
          height: 630,
          alt: 'FourScore Website Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FourScore: Match Your Vote with Your Values',
      description:
        'FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized "Four Score," reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values.',
      images: 'https://fourscore.app/images/website-preview.png',
    },
  };
};

export const generateCommonMetadata = async (options: CommonMetadataOptions): Promise<Metadata> => {
  const baseMetadata = await fetchBaseMetadata();

  const metadata: Metadata = {
    ...baseMetadata,
    ...(options.title && { title: options.title }),
    ...(options.description && { description: options.description }),
    ...(options.keywords && { keywords: options.keywords }),
    openGraph: {
      ...baseMetadata.openGraph,
      ...(options.title && { title: options.title }),
      ...(options.description && { description: options.description }),
      ...(options.url && { url: options.url }),
      ...(options.openGraphType && { type: options.openGraphType }),
      ...(options.images && { images: options.images }),
    },
    twitter: {
      ...baseMetadata.twitter,
      card: 'summary_large_image',
      ...(options.title && { title: options.title }),
      ...(options.description && { description: options.description }),
      ...(options.images && { image: options.images[0]?.url }),
    },
  };

  return metadata;
};

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
