'use client';

import { CandidateResult } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CandidateCard from './candidate-card';

export default function CandidateList({
  candidates,
  withoutPledging = false,
}: {
  candidates: CandidateResult[];
  withoutPledging?: boolean;
}) {
  const router = useRouter();

  const [pledgedCandidate, setPledgedCandidate] = useState<CandidateResult>(candidates[0]);

  useEffect(() => {
    const selected = candidates.find((c) => c === pledgedCandidate);
    if (!selected) {
      setPledgedCandidate(candidates[0]);
    }
  }, [candidates, pledgedCandidate]);

  useEffect(() => {
    if (!localStorage.getItem('refresh-candidates')) {
      localStorage.setItem('refresh-candidates', 'true');
      router.refresh();
    } else {
      localStorage.removeItem('refresh-candidates');
    }
  }, []);

  return (
    <div className='grid grid-cols-1 gap-2'>
      {candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={pledgedCandidate === candidate}
          onSelect={(selectedCandidate) => setPledgedCandidate(selectedCandidate)}
          hidePledge={withoutPledging}
          descriptionHtml={candidate.candidateData?.description || ''}
        />
      ))}
    </div>
  );
}
