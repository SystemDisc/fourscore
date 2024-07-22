'use client';

import styles from '@/app/normalize.module.scss';
import { CandidateResult } from '@/types';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../atoms/star';
import PledgeToggle from './pledge-toggle';

export default function CandidateCard({
  candidate,
  descriptionHtml = '',
  selected,
  onSelect,
  hidePledge = false,
}: {
  candidate: CandidateResult;
  descriptionHtml?: string;
  selected?: boolean;
  onSelect?: (candidate: CandidateResult) => void;
  hidePledge?: boolean;
}) {
  return (
    <div
      className={classNames('grid gap-4 hover: cursor-pointer', {
        'grid-cols-[3rem_1fr]': !hidePledge,
        'grid-cols-1': hidePledge,
      })}
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
      <Link
        className='h-[calc(1rem_+_4rem_+_2px)] overflow-hidden border border-neutral-300 rounded-lg shadow-md shadow-neutral-500 grid [grid-template-columns:4rem_1fr] gap-2 p-2 hover:bg-neutral-100'
        href={`/candidate-profile/${candidate.id}`}
      >
        <div>
          {candidate.image && (
            <Image
              src={candidate.image}
              className='h-16 w-16 rounded-lg border-2 border-neutral-300 shadow-md shadow-neutral-500'
              width={256}
              height={256}
              alt={candidate.name || 'Candidate'}
            />
          )}
        </div>
        <div className='[line-height:12px] flex flex-col items-start justify-start overflow-hidden'>
          <span className='flex items-start leading-none'>{candidate.name}</span>
          <hr className='border-b-[0.5px] border-black w-full' />
          {candidate.score ? (
            <>
              <span className='flex items-center mt-1.5 mb-1.5'>Four Score: {candidate.score}%</span>
              <Star
                rate={Math.round(candidate.score / 20)}
                displayEmptyStar
              />
            </>
          ) : (
            candidate.candidateData?.description && (
              <div
                className={classNames('text-xs [&_*]:!my-0 [&_*]:!py-0 [&_ul]:!pl-4', styles.normalize)}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            )
          )}
        </div>
      </Link>
    </div>
  );
}
