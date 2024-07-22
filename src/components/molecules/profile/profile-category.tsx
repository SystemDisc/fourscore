import styles from '@/app/normalize.module.scss';
import Star from '@/components/atoms/star';
import { CandidateResult, CategoryWithQuestions, CategoryWithQuestionsAndScore, QuestionWithAnswer } from '@/types';
import { renderMarkdown } from '@/utils/markdown';
import { getLocalities } from '@/utils/server-actions';
import classNames from 'classnames';
import moment from 'moment';
import { ReactNode } from 'react';
import LinkWithBackDetection from '../link-with-back-detection';

export default async function ProfileCategory({
  candidate,
  category,
}: {
  candidate: CandidateResult;
  category: CategoryWithQuestions & Partial<CategoryWithQuestionsAndScore>;
}) {
  const localities = await getLocalities();

  return (
    <div className='flex flex-col justify-between'>
      <div className='p-4 grid grid-cols-1 gap-4'>
        <div className='text-4xl font-light'>{candidate.name}&apos;s Answers</div>
        <LinkWithBackDetection
          className='text-sm uppercase w-fit m-auto'
          isButton
          href={`/candidate-profile/${candidate.id}`}
        >
          Answer Categories
        </LinkWithBackDetection>
      </div>
      <div className='p-4 border-y border-neutral-300 bg-neutral-100'>
        <div className='text-2xl font-light'>{category.name}</div>
        {category.similarityScore && (
          <div className='flex flex-row gap-2 items-center'>
            <div className='text-lg font-light flex items-center'>{category.similarityScore}% Similar</div>
            <Star
              rate={category.similarityScore / 20}
              displayEmptyStar
            />
          </div>
        )}
      </div>
      {await (category.questions.filter((q) => q.answer) as QuestionWithAnswer[]).reduce(async (nodes, question) => {
        const locality = localities.find((l) => l.id === question.localityId);

        return [
          ...(await nodes),
          <div
            key={question.id}
            className='flex flex-col font-light'
          >
            <div className='flex flex-col justify-between p-4 bg-gradient-to-bl from-[#7E8287] to-[#474B4F] text-white'>
              {locality && <div className='font-bold'>{locality.name} Policy Question: </div>}
              <div className='text-lg'>{question.question}</div>
            </div>
            <div className='p-4'>
              <ol className='border-l-4 border-gray-200 dark:border-gray-700 grid grid-cols-1 gap-4'>
                <li className='ml-4 relative'>
                  <div className='absolute w-[14px] h-[14px] bg-gray-200 rounded-full top-[7px] -left-[calc(1rem_+_7px_+_2px)] border border-white dark:border-gray-900 dark:bg-gray-700 from-[#69F7A5] to-[#22C064] bg-gradient-to-bl'></div>
                  <div className='text-lg font-normal flex items-center justify-start gap-2'>
                    <span>{moment(question.answer.dateUpdated).format('llll')}</span>
                    {question.answer.answeredByStaff && (
                      <span className='text-sm text-neutral-400 tracking-wide font-bold'>
                        {' '}
                        <span className='inline-flex gap-1'>
                          <span>(</span>answered by FourScore staff<span>)</span>
                        </span>
                      </span>
                    )}
                  </div>
                  <div>
                    <div className='text-lg'>{question.answer.agree ? 'Yes' : 'No'}</div>
                    <Star
                      rate={question.answer.rating || 0}
                      displayEmptyStar
                    />
                    {question.answer.notes && (
                      <div
                        className={classNames('text-lg font-light', styles.normalize)}
                        dangerouslySetInnerHTML={{
                          __html: await renderMarkdown(question.answer.notes),
                        }}
                      />
                    )}
                  </div>
                </li>
              </ol>
            </div>
          </div>,
        ];
      }, Promise.resolve([] as ReactNode[]))}
    </div>
  );
}
