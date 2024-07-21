'use client';

import { CandidateResult, CategoryWithQuestionsAndScore } from '@/types';
import ProfileAnswer from './profile-answer';

export default function ProfileAnswers({
  candidate,
  candidateQuestionsWithScore,
}: {
  candidate: CandidateResult;
  candidateQuestionsWithScore: CategoryWithQuestionsAndScore[];
}) {
  return (
    <div className='flex flex-col justify-between gap-2 p-4'>
      <div className='text-4xl font-light	py-2'>{candidate.name}&apos;s Answers</div>
      <div className='py-4'>
        {candidateQuestionsWithScore?.map((category) => (
          <ProfileAnswer
            key={category.id}
            candidateId={candidate.id}
            data={category}
          />
        ))}
      </div>
    </div>
  );
}
