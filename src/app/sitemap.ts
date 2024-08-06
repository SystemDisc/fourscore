import { getCandidates } from '@/utils/server-actions';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const candidates = await getCandidates();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: 'https://fourscore.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://fourscore.app/about',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://fourscore.app/candidates',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://fourscore.app/poll',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://fourscore.app/account-needed',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: 'https://fourscore.app/terms',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: 'https://fourscore.app/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  const candidateRoutes: MetadataRoute.Sitemap = candidates.map((candidate) => ({
    url: `https://fourscore.app/candidate-profile/${candidate.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...candidateRoutes];
}
