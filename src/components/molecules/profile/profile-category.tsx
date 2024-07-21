import styles from '@/app/normalize.module.scss';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { CandidateResult, CategoryWithQuestionsAndScore, QuestionWithAnswer } from '@/types';
import { calculateRateFromScore } from '@/utils/calc';
import classNames from 'classnames';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import moment from 'moment';
import { ReactNode } from 'react';

export default async function ProfileCategory({
  candidate,
  category,
}: {
  candidate: CandidateResult;
  category: CategoryWithQuestionsAndScore;
}) {
  return (
    <div className='flex flex-col justify-between'>
      <div className='p-4 grid grid-cols-1 gap-4'>
        <div className='text-4xl font-light'>{candidate.name}&apos;s Answers</div>
        <Button
          className='text-sm uppercase w-fit m-auto'
          isLink
          href={`/candidate-profile/${candidate.id}`}
        >
          Answer Categories
        </Button>
      </div>
      <div className='p-4 border-y border-neutral-300 bg-neutral-100'>
        <div className='text-2xl font-light'>{category.name}</div>
        <div className='flex flex-row gap-2 items-center'>
          <div className='text-lg font-light flex items-center'>{category.similarityScore}% Similar</div>
          <Star rate={calculateRateFromScore(category.similarityScore)} />
        </div>
      </div>
      {await (category.questions.filter((q) => q.answer) as QuestionWithAnswer[]).reduce(
        async (nodes, question) => [
          ...(await nodes),
          <div
            key={question.id}
            className='flex flex-col font-light'
          >
            <div
              className='flex flex-col justify-between gap-6 p-4 min-h-[80px]'
              style={{ background: 'linear-gradient(-45deg, #7E8287, #474B4F' }}
            >
              <div className='text-lg text-white'>{question.question}</div>
            </div>
            <div className='p-4'>
              <ol className='border-l-4 border-gray-200 dark:border-gray-700 grid grid-cols-1 gap-4'>
                <li className='ml-4 relative'>
                  <div className='absolute w-[14px] h-[14px] bg-gray-200 rounded-full top-[7px] -left-[calc(1rem_+_7px_+_2px)] border border-white dark:border-gray-900 dark:bg-gray-700 from-[#69F7A5] to-[#22C064] bg-gradient-to-bl'></div>
                  <div className='text-lg font-normal'>{moment(question.answer.dateUpdated).format('llll')}</div>
                  <div>
                    <div className='text-lg'>{question.answer.agree ? 'Yes' : 'No'}</div>
                    <Star rate={question.answer.rating || 0} />
                    {question.answer.notes && (
                      <div
                        className={classNames('text-lg font-light', styles.normalize)}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(await marked(question.answer.notes)) }}
                      />
                    )}
                  </div>
                </li>
              </ol>
            </div>
          </div>,
        ],
        Promise.resolve([] as ReactNode[]),
      )}
    </div>
  );
}
