'use client';

import { CandidateResult } from '@/types';
import CandidateCard from './candidate-card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateList({ candidates }: { candidates: CandidateResult[] }) {
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
