import { CandidateResult } from '@/types';

export const generateProfileJsonLd = (candidate: CandidateResult) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `https://fourscore.app/candidate-profile/${candidate.id}`,
    name: candidate.name,
    description: candidate.candidateData?.description,
    dateCreated: candidate.dateCreated,
    dateModified: candidate.dateUpdated,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: candidate.candidateData?.profileImage,
      caption: candidate.name,
    },
    about: {
      '@type': 'Person',
      name: candidate.name,
      description: candidate.candidateData?.description,
      birthDate: candidate.candidateData?.birthDate,
      birthPlace: candidate.candidateData?.birthPlace,
      alumniOf: candidate.candidateData?.education,
      memberOf: candidate.candidateData?.partyAffiliation,
      image: candidate.candidateData?.profileImage,
      sameAs: [
        candidate.candidateData?.facebookProfile,
        candidate.candidateData?.twitterProfile,
        candidate.candidateData?.linkedInProfile,
      ],
      url: candidate.candidateData?.websiteUrl,
      worksFor: {
        '@type': 'Organization',
        name: candidate.candidateData?.partyAffiliation,
      },
      knowsAbout: candidate.candidateData?.issues,
      hasOccupation: candidate.candidateData?.previousPositions?.map((position) => ({
        '@type': 'Occupation',
        name: position,
      })),
    },
    mainEntity: {
      '@type': 'Person',
      name: candidate.name,
      description: candidate.candidateData?.description,
      birthDate: candidate.candidateData?.birthDate,
      birthPlace: candidate.candidateData?.birthPlace,
      alumniOf: candidate.candidateData?.education,
      memberOf: candidate.candidateData?.partyAffiliation,
      image: candidate.candidateData?.profileImage,
      sameAs: [
        candidate.candidateData?.facebookProfile,
        candidate.candidateData?.twitterProfile,
        candidate.candidateData?.linkedInProfile,
      ],
      url: candidate.candidateData?.websiteUrl,
      worksFor: {
        '@type': 'Organization',
        name: candidate.candidateData?.partyAffiliation,
      },
      knowsAbout: candidate.candidateData?.issues,
      hasOccupation: candidate.candidateData?.previousPositions?.map((position) => ({
        '@type': 'Occupation',
        name: position,
      })),
    },
  };
};

export const generateCandidateJsonLd = (candidates: CandidateResult[]) => {
  return candidates.map((candidate) => ({
    '@type': 'ViewAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `https://fourscore.app/candidate-profile/${candidate.id}`,
      actionPlatform: ['http://schema.org/WebApplication', 'http://schema.org/MobileWebApplication'],
      inLanguage: 'en',
    },
    name: candidate.name,
  }));
};
