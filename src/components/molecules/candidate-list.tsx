'use client';

import { User } from '@/db/database';
import { CandidateResult } from '@/types';
import { getPledgedCandidate, pledgeCandidate } from '@/utils/server-actions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CandidateCard from './candidate-card';

export default function CandidateList({
  candidates,
  withoutPledging = false,
}: {
  candidates: CandidateResult[];
  withoutPledging?: boolean;
}) {
  const { data: session } = useSession();

  const [pledgedCandidate, setPledgedCandidate] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selected = candidates.find((c) => c.id === pledgedCandidate?.id);
    if (!selected && session && !loading) {
      setLoading(true);
      (async () => {
        const alreadyPledgedCandidate = await getPledgedCandidate(session?.user);
        if (alreadyPledgedCandidate) {
          setPledgedCandidate(alreadyPledgedCandidate);
        } else {
          setPledgedCandidate(candidates[0]);
          await pledgeCandidate(session?.user, candidates[0]);
        }
        setLoading(false);
      })().catch(console.error);
    }
  }, [candidates, pledgedCandidate, session, loading]);

  return (
    <div className='grid grid-cols-1 gap-2'>
      {candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={pledgedCandidate?.id === candidate.id}
          onSelect={async (selectedCandidate) => {
            setPledgedCandidate(selectedCandidate);
            await pledgeCandidate(session?.user, selectedCandidate);
          }}
          hidePledge={withoutPledging}
          descriptionHtml={candidate.candidateData?.description || ''}
        />
      ))}
    </div>
  );
}
