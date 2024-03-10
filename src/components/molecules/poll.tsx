'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Button from '../atoms/button';
import { BsStarFill } from 'react-icons/bs';
import { savePoll } from '@/utils/server-actions';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Simplify } from 'kysely';
import { AnswerUpdate, Category, Locality, Question } from '@/db/database';

export default function Poll({
  questions,
}: {
  questions: Simplify<Question & {
    locality: Simplify<Locality> | null,
    category: Simplify<Category> | null,
    answer: Simplify<AnswerUpdate> | null,
  }>[];
}) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const foundIndex = questions.findIndex((q) => typeof q.answer?.agree === 'undefined');
  const [currentIndex, setCurrentIndex] = useState(foundIndex >= 0 ? foundIndex : questions.length - 1);
  const [agree, setAgree] = useState<boolean | undefined>(foundIndex >= 0 ? questions[foundIndex]?.answer?.agree : (questions.length > 0 ? questions[questions.length - 1]?.answer?.agree : undefined));
  const [rating, setRating] = useState<number | undefined>(foundIndex >= 0 ? questions[foundIndex]?.answer?.rating : (questions.length > 0 ? questions[questions.length - 1]?.answer?.rating : undefined));
  const [answers, setAnswers] = useState<Simplify<AnswerUpdate>[]>(questions.map((q) => (q.answer || {
    questionId: q.id,
  })));

  if (!session || !session.user) {
    if (status !== 'loading') {
      router.push('/');
      return null;
    }
  }

  return (
    <section className='grid grid-cols-1'>
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div>
          <Button
            buttonType='flat'
            className='w-full'
            disabled={currentIndex === 0}
            onClick={() => {
              setCurrentIndex(currentIndex - 1);
              setAgree(answers[currentIndex - 1].agree);
              setRating(answers[currentIndex - 1].rating);
            }}
          >
            Back
          </Button>
        </div>
        <div>
          <Button buttonType='flat' className='w-full' onClick={async () => {
            await savePoll(session?.user, answers);
            router.push('/dashboard');
          }}>
            Save &amp; Exit
          </Button>
        </div>
      </div>
      <div className='h-4 border-y border-black relative'>
        <div
          className={classNames('bg-[#22C064] h-full', {
            'rounded-r-full': currentIndex + 1 !== questions.length,
          })}
          style={{
            width: `${(currentIndex + 1) / questions.length * 100}%`,
          }}
        />
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center text-xs font-bold'>
          {Math.round((currentIndex + 1) / questions.length * 100).toFixed(0)}%
        </div>
      </div>
      {questions.map((question, index) => (
        <section
          key={question.id}
          className={classNames('min-h-[calc(100dvh_-_3rem_-_42px)] md:min-h-[calc(100dvh_-_5rem_-_44px)]', {
            'hidden': index !== currentIndex,
          })}
        >
          <div className='h-28 bg-gradient-to-bl from-[#6932D1] to-[#899ED4] flex items-end justify-between p-4'>
            <div className='text-4xl text-white'>
              {question.locality?.name}
            </div>
            <div className='grid grid-cols-3 gap-4 pb-1'>
              <img src='/images/house.svg' width={44} height={39} />
              <img src='/images/house.svg' width={44} height={39} />
              <img src='/images/house.svg' width={44} height={39} />
            </div>
          </div>
          <div
            className={classNames('flex flex-col items-center justify-between gap-4 p-4 h-[calc(100%_-_7rem)]', {
              'hidden': index !== currentIndex,
            })}
          >
            <div>
              {question.category &&
                <h1 className='font-bold text-2xl text-center'>
                  {question.category.name}
                </h1>
              }
              <h2 className='text-center'>
                {question.question}
              </h2>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex justify-center gap-4'>
                <Button
                  className={classNames('rounded-full text-2xl h-16 w-16', {
                    'outline outline-4 outline-offset-2 outline-[#6932D1]': agree === true
                  })}
                  onClick={() => setAgree(true)}
                >
                  Yes
                </Button>
                <Button
                  className={classNames('rounded-full text-2xl h-16 w-16', {
                    'outline outline-4 outline-offset-2 outline-[#6932D1]': agree === false
                  })}
                  onClick={() => setAgree(false)}
                >
                  No
                </Button>
              </div>
              <div className='grid grid-cols-5 gap-4'>
                <div className='flex flex-col items-center gap-4'>
                  <Button
                    className={classNames('rounded-full text-2xl h-14 w-14', {
                      'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 1
                    })}
                    onClick={() => setRating(1)}
                  >
                    1
                  </Button>
                  <span className='text-neutral-500 text-xl'>
                    Least
                  </span>
                </div>
                <div>
                  <Button
                    className={classNames('rounded-full text-2xl h-14 w-14', {
                      'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 2
                    })}
                    onClick={() => setRating(2)}
                  >
                    2
                  </Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                  <Button
                    className={classNames('rounded-full text-2xl h-14 w-14', {
                      'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 3
                    })}
                    onClick={() => setRating(3)}
                  >
                    3
                  </Button>
                  <span className='text-neutral-500 text-xl'>
                    Some
                  </span>
                </div>
                <div>
                  <Button
                    className={classNames('rounded-full text-2xl h-14 w-14', {
                      'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 4
                    })}
                    onClick={() => setRating(4)}
                  >
                    4
                  </Button>
                </div>
                <div className='flex flex-col items-center gap-4'>
                  <Button
                    className={classNames('rounded-full text-2xl h-14 w-14', {
                      'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 5
                    })}
                    onClick={() => setRating(5)}
                  >
                    <BsStarFill />
                  </Button>
                  <span className='text-neutral-500 text-xl'>
                    Most
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4'>
                <Button
                  className='text-2xl'
                  disabled={agree === undefined || rating === undefined}
                  onClick={async () => {
                    const newAnswers = [...answers];
                    newAnswers[index].agree = agree;
                    newAnswers[index].rating = rating;
                    setAnswers(newAnswers);
                    const nextIndex = currentIndex + 1;
                    if (nextIndex < questions.length) {
                      setCurrentIndex(currentIndex + 1);
                      setAgree(answers[currentIndex + 1].agree);
                      setRating(answers[currentIndex + 1].rating);
                    } else {
                      setAnswers((answers) => {
                        (async () => {
                          await savePoll(session?.user, answers);
                          router.push('/candidate-matches');
                        })().catch(console.error);
                        return answers;
                      });
                    }
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}
