import { CandidateResult } from '@/types';
import Link from 'next/link';
import { BsStar, BsStarFill } from 'react-icons/bs';
import PledgeToggle from './pledge-toggle';

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
}: {
  candidate: CandidateResult;
  selected?: boolean;
  onSelect?: (candidate: CandidateResult) => void;
}) {
  return (
    <Link
      key={candidate.id}
      className='grid [grid-template-columns:3rem_1fr] gap-4 hover: cursor-pointer'
      href={`/candidate-profile/${candidate.id}`}
    >
      <div>
        <PledgeToggle
          checked={selected}
          onToggle={(checked) => {
            if (checked) {
              onSelect?.(candidate);
            }
          }}
        />
      </div>
      <div className='border border-neutral-300 rounded shadow-[#000_0px_2px_2px] grid [grid-template-columns:4rem_1fr] gap-2 p-2'>
        <div>
          {candidate.image && (
            <img
              src={candidate.image}
              className='h-16 w-16'
              alt={candidate.name || 'Candidate'}
            />
          )}
        </div>
        <div className='[line-height:12px] grid grid-cols-1 grid-rows-3 gap-2'>
          <div className='flex items-start'>{candidate.name}</div>
          <div className='flex items-center'>Four Score: {candidate.score}%</div>
          <div className='flex items-end text-[#22C064]'>
            {Math.round((candidate.score / 100) * 5) > 0 &&
              Array(Math.round((candidate.score / 100) * 5))
                .fill(null)
                .map((_, index) => <BsStarFill key={index}></BsStarFill>)}
            {5 - Math.round((candidate.score / 100) * 5) > 0 &&
              Array(5 - Math.round((candidate.score / 100) * 5))
                .fill(null)
                .map((_, index) => <BsStar key={index}></BsStar>)}
          </div>
        </div>
      </div>
    </Link>
  );
}
