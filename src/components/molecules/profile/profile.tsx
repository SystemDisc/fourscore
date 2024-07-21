import styles from '@/app/normalize.module.scss';
import AnswerItem from '@/components/atoms/answer-item';
import Card from '@/components/atoms/card';
import { CandidateResult, CategoryWithQuestionsAndScore } from '@/types';
import { renderMarkdown } from '@/utils/markdown';
import classNames from 'classnames';

export default async function Profile({
  candidate,
  candidateQuestionsWithScore,
}: {
  candidate: CandidateResult;
  candidateQuestionsWithScore?: CategoryWithQuestionsAndScore[];
}) {
  return (
    <div className='grid grid-cols-1 gap-2 p-2'>
      {candidate.candidateData?.description && (
        <Card className='p-4'>
          <div className='text-4xl'>{candidate.name}</div>
          <hr className='border-black' />
          <div
            className={classNames('text-lg', styles.normalize)}
            dangerouslySetInnerHTML={{ __html: await renderMarkdown(candidate.candidateData?.description) }}
          />
        </Card>
      )}
      {(candidateQuestionsWithScore || candidate.categories) && (
        <Card className='grid grid-cols-1 gap-2 p-2'>
          <div className='text-4xl'>
            {candidate.candidateData?.description ? 'Poll' : `${candidate.name}'s`} Answers
          </div>
          <hr className='border-black' />
          {(
            candidateQuestionsWithScore ||
            candidate.categories?.map((c) => ({ ...c, similarityScore: undefined })) ||
            []
          ).map((category) => (
            <AnswerItem
              key={category.id}
              title={category.name}
              score={category.similarityScore}
              candidateId={candidate.id}
              categoryId={category.id}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
