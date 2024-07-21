import { CandidateResult } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { BsStar, BsStarFill } from 'react-icons/bs';
import PledgeToggle from './pledge-toggle';

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
  hidePledge = false,
}: {
  candidate: CandidateResult;
  selected?: boolean;
  onSelect?: (candidate: CandidateResult) => void;
  hidePledge?: boolean;
}) {
  return (
    <Link
      key={candidate.id}
      className={classNames('grid gap-4 hover: cursor-pointer', {
        'grid-cols-[3rem_1fr]': !hidePledge,
        'grid-cols-1': hidePledge,
      })}
      href={`/candidate-profile/${candidate.id}`}
    >
      {!hidePledge && (
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
      )}
      <div className='border border-neutral-300 rounded shadow-[#000_0px_2px_2px] grid [grid-template-columns:4rem_1fr] gap-2 p-2'>
        <div>
          {candidate.image && (
            <Image
              src={candidate.image}
              className='h-16 w-16'
              width={256}
              height={256}
              alt={candidate.name || 'Candidate'}
            />
          )}
        </div>
        <div className='[line-height:12px] grid grid-cols-1 grid-rows-3 gap-1'>
          <div className='flex items-start leading-none'>{candidate.name}</div>
          {candidate.score ? (
            <>
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
            </>
          ) : (
            candidate.offices.length > 0 && (
              <ul className='list-disc list-inside ml-1'>
                {candidate.offices.map((office) => (
                  <li className='text-xs text-neutral-500 leading-none'>
                    Running for {office.name} of {office.location}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
