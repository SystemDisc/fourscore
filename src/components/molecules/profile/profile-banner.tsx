import Star from '@/components/atoms/star';
import { CandidateResult, UserWithAnswers } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProfileBanner({
  currentUser,
  candidate,
}: {
  currentUser?: UserWithAnswers;
  candidate: CandidateResult;
}) {
  const pollCompleteness = () => {
    if (candidate.answers.length) {
      return currentUser ? Math.round((candidate.answers.length / currentUser.questionsTotal) * 10000) / 100 : 100;
    }
    return 0;
  };

  return (
    <div
      className='flex flex-col justify-between gap-4 p-4'
      style={{ background: 'linear-gradient(45deg, rgb(33, 34, 37), rgb(67, 70, 74), rgb(33, 34, 37))' }}
    >
      <div className='flex flex-col'>
        <div className='text-4xl text-white font-bold'>{candidate.name}</div>
        <hr className='border border-white w-full' />
        <div className='text-xs text-white mt-1'>For: President of The United States of America</div>
      </div>

      <div className='grid grid-cols-2'>
        {candidate.image && (
          <Link
            className='block w-full h-auto border-4 border-neutral-300 shadow-lg shadow-black rounded-full overflow-hidden'
            href={candidate.image}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className='w-full h-auto object-cover'
              src={candidate.image}
              alt='Profile'
              width={1023}
              height={1023}
            />
          </Link>
        )}
        {!candidate.image && (
          <div className='w-full h-full border-4 border-neutral-300 shadow-lg shadow-black rounded-full overflow-hidden'>
            <Image
              className='w-full h-full object-cover'
              src={'https://via.placeholder.com/256'}
              alt='Profile'
              width={256}
              height={256}
            />
          </div>
        )}
        <div className='flex justify-end items-end content-end flex-col'>
          <div className='w-full text-right'>
            <div className='text-lg text-white uppercase'>Poll Complete: {pollCompleteness()}%</div>
          </div>
          <hr className='border border-white w-full' />
          {candidate.candidateUserScore?.score && (
            <div className='flex flex-col'>
              <div className='text-sm text-white uppercase'>Four Score</div>
              <div className='flex flex-row items-center gap-2'>
                <div className='text-lg text-white uppercase'>{candidate.candidateUserScore.score}%</div>
                <Star
                  rate={Math.round(candidate.candidateUserScore.score / 20)}
                  displayEmptyStar
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
