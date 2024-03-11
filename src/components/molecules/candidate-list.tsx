'use client';

import { CandidateResult } from '@/types';
import CandidateCard from './candidate-card';
import { useEffect, useState } from 'react';

export default function CandidateList({
  candidates
}: {
  candidates: CandidateResult[]
}) {
  const [pledgedCandidate, setPledgedCandidate] = useState<CandidateResult>(candidates[0]);

  useEffect(() => {
    const selected = candidates.find((c) => c === pledgedCandidate);
    if (!selected) {
      setPledgedCandidate(candidates[0]);
    }
  }, [candidates, pledgedCandidate])

  return (
    <div className='grid grid-cols-1 gap-4'>
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={pledgedCandidate === candidate}
          onSelect={(selectedCandidate) => setPledgedCandidate(selectedCandidate)}
        />
      ))}
    </div>
  );
}
