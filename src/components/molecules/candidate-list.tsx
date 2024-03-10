'use client';

import { CandidateResult } from '@/types';
import CandidateCard from './candidate-card';
import { useState } from 'react';

export default function CandidateList({
  candidates
}: {
  candidates: CandidateResult[]
}) {
  const [pledgedCandidate, setPledgedCandidate] = useState<CandidateResult>();

  return (
    <>
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={pledgedCandidate === candidate}
          onSelect={(selectedCandidate) => setPledgedCandidate(selectedCandidate)}
        />
      ))}
    </>
  );
}
