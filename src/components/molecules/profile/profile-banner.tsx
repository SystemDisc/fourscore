import Star from '@/components/atoms/star';
import { CandidateResult, UserWithAnswers } from '@/types';
import Image from 'next/image';

export default function ProfileBanner({
  currentUser,
  candidate,
}: {
  currentUser: UserWithAnswers;
  candidate: CandidateResult;
}) {
  const pollCompleteness = () => {
    if (candidate.answers.length) {
      return Math.round((candidate.answers.length / currentUser.questionsTotal) * 10000) / 100;
    }
    return 0;
  };

  return (
    <div
      className='flex flex-col justify-between gap-6 p-4'
      style={{ background: 'linear-gradient(45deg, rgb(33, 34, 37), rgb(67, 70, 74), rgb(33, 34, 37))' }}
    >
      <div className='flex flex-col'>
        <div className='text-lg text-white'>{candidate.name}</div>
        <div className='text-xs text-white'>For: President of The United States of America</div>
      </div>

      <div className='flex flex-row justify-around'>
        <div className='relative w-36 h-36 rounded-full overflow-hidden cursor-pointer group'>
          <Image
            className='w-full h-full object-cover'
            src={candidate.image || 'https://via.placeholder.com/256'}
            alt='Profile'
            width={256}
            height={256}
          />
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <span className='text-white'>Edit</span>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div>
            <div className='text-sm text-white uppercase'>Poll complete</div>
            <div className='text-lg text-white uppercase'>{pollCompleteness()}%</div>
          </div>
          {candidate.candidateUserScore?.score && (
            <div className='flex flex-col'>
              <div className='text-sm text-white uppercase'>Four Score</div>
              <div className='flex flex-row items-center gap-2'>
                <div className='text-lg text-white uppercase'>{candidate.candidateUserScore.score}%</div>
                <Star
                  rate={Math.round(candidate.candidateUserScore.score / 20)}
                  displayEmptyStar={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
