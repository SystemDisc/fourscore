'use client';

import { AnswerUpdate, Category, Locality, Question } from '@/db/database';
import { markTutorialShown, savePoll } from '@/utils/server-actions';
import classNames from 'classnames';
import { Simplify } from 'kysely';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsStarFill } from 'react-icons/bs';
import Button from '../atoms/button';
import Loading from '../atoms/loading';

export default function Poll({
  questions,
  allAnswers,
  seenVotingTutorial,
}: {
  questions: Simplify<
    Question & {
      locality: Simplify<Locality> | null;
      category: Simplify<Category> | null;
      answer: Simplify<AnswerUpdate> | null;
    }
  >[];
  allAnswers: {
    questionId: string;
    yesCount: string;
    noCount: string;
  }[];
  seenVotingTutorial?: boolean;
}) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const foundIndex = questions.findIndex((q) => q.answer?.agree === undefined || q.answer.agree === null);
  const [currentIndex, setCurrentIndex] = useState(foundIndex >= 0 ? foundIndex : questions.length - 1);
  const [agree, setAgree] = useState<boolean | null | undefined>(
    foundIndex >= 0
      ? questions[foundIndex]?.answer?.agree
      : questions.length > 0
      ? questions[questions.length - 1]?.answer?.agree
      : undefined,
  );
  const [rating, setRating] = useState<number | null | undefined>(
    foundIndex >= 0
      ? questions[foundIndex]?.answer?.rating
      : questions.length > 0
      ? questions[questions.length - 1]?.answer?.rating
      : undefined,
  );
  const [answers, setAnswers] = useState<Simplify<AnswerUpdate>[]>(
    questions.map(
      (q) =>
        q.answer || {
          questionId: q.id,
        },
    ),
  );
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialShown, setTutorialShown] = useState(!!seenVotingTutorial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const storedPollJson = localStorage.getItem('poll');
      if (storedPollJson) {
        const storedPoll = JSON.parse(storedPollJson) as Simplify<AnswerUpdate>[];
        setAnswers(storedPoll);
        const foundIndex = storedPoll.findIndex((a) => a.agree === undefined || a.agree === null);
        if (foundIndex > 0) {
          setCurrentIndex(foundIndex);
          setTutorialShown(true);
        }
      }
    }
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (agree !== undefined && agree !== null && !tutorialShown) {
      setTutorialShown(true);
      setShowTutorial(true);
    }
  }, [agree, tutorialShown, rating]);

  useEffect(() => {
    if (showTutorial && rating !== undefined && rating !== null) {
      setShowTutorial(false);
      if (session?.user) {
        (async () => {
          await markTutorialShown(session?.user);
        })().catch(console.error);
      }
    }
  }, [showTutorial, rating, session?.user]);

  const numAnswers = answers.reduce(
    (sum, a) =>
      !!questions.find((q) => q.id === a.questionId) &&
      a.agree !== undefined &&
      a.agree !== null &&
      a.rating !== undefined &&
      a.rating !== null
        ? sum + 1
        : sum,
    0,
  );

  return (
    <section className='grid grid-cols-1 relative'>
      {showTutorial && (
        <>
          <div className='absolute flex flex-col gap-4 left-0 top-0 right-0 bottom-0 z-50 text-white justify-end max-w-lg mx-auto p-4 pointer-events-none pb-[40%]'>
            <p>Now that you&apos;ve answered the question, how important is this issue to you?</p>
            <p>
              1 = Not Important
              <br />
              4 = Important
              <br />
              STAR = Super Important
            </p>
          </div>
          <div className='absolute h-16 w-[20rem] shadow-[rgba(0_0_0_/_0.85)_0_0_0_1000px] bottom-[calc(28px_+_1rem_+_50px_+_1rem_+_42px_+_1rem)] left-[50%] translate-x-[-50%] rounded-full z-40 pointer-events-none' />
        </>
      )}
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div>
          <Button
            isLink
            href='/'
            buttonType='flat-black'
            className='w-full'
            onClick={(e) => {
              e.preventDefault();
              const newAnswers = [...answers];
              newAnswers[currentIndex].agree = agree;
              newAnswers[currentIndex].rating = rating;
              newAnswers[currentIndex].skipped = false;
              setAnswers(newAnswers);
              if (!session?.user) {
                localStorage.setItem('poll', JSON.stringify(newAnswers));
                router.push('/');
              } else {
                (async () => {
                  await savePoll(session.user, answers);
                  if (numAnswers === questions.length) {
                    router.push('/candidate-matches');
                  } else {
                    router.push('/dashboard');
                  }
                })();
              }
            }}
          >
            Home
          </Button>
        </div>
        <div>
          <Button
            buttonType='flat-black'
            className='w-full'
            onClick={async () => {
              const newAnswers = [...answers];
              newAnswers[currentIndex].agree = agree;
              newAnswers[currentIndex].rating = rating;
              newAnswers[currentIndex].skipped = false;
              setAnswers(newAnswers);
              if (!session?.user) {
                localStorage.setItem('poll', JSON.stringify(newAnswers));
                router.push('/account-needed');
              } else {
                await savePoll(session.user, answers);
                if (numAnswers === questions.length) {
                  router.push('/candidate-matches');
                } else {
                  router.push('/dashboard');
                }
              }
            }}
          >
            Save &amp; Exit
          </Button>
        </div>
      </div>
      <div className='h-4 border-y border-black relative z-10'>
        <div
          className={classNames('bg-[#22C064] h-full', {
            'rounded-r-full': numAnswers !== questions.length,
          })}
          style={{
            width: `${(numAnswers / questions.length) * 100}%`,
          }}
        />
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center text-xs font-bold'>
          {Math.round((numAnswers / questions.length) * 100).toFixed(0)}%
        </div>
      </div>
      <div className='flex items-center h-2 overflow-visible relative touch-none'>
        <input
          className='w-full'
          type='range'
          value={currentIndex}
          min={0}
          max={questions.length - 1}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[currentIndex].agree = agree;
            newAnswers[currentIndex].rating = rating;
            setAnswers(newAnswers);
            setCurrentIndex(+e.target.value);
            setAgree(answers[+e.target.value].agree);
            setRating(answers[+e.target.value].rating);
          }}
        />
      </div>
      <section className='min-h-[calc(100dvh_-_3.5rem_-_42px)] md:min-h-[calc(100dvh_-_5.5rem_-_42px_-_2px)] relative z-10'>
        {(status === 'loading' || loading) && (
          <Loading className='absolute left-0 top-0 right-0 bottom-0 bg-white !items-start z-10' />
        )}
        {questions.map((question, index) => {
          const answerData = allAnswers.find((a) => a.questionId === question.id);

          return (
            <div
              key={question.id}
              className={classNames('h-full', {
                hidden: index !== currentIndex,
              })}
            >
              <div className='h-20 bg-gradient-to-bl from-[#6932D1] to-[#899ED4]'>
                <div className='flex items-end justify-between p-4'>
                  <div className='text-4xl text-white'>{question.locality?.name}</div>
                  <div className='grid grid-cols-3 gap-4 pb-1'>
                    <Image
                      alt='Icon of a house'
                      src='/images/house.svg'
                      width={44}
                      height={39}
                    />
                    <Image
                      alt='Icon of a house'
                      src='/images/house.svg'
                      width={44}
                      height={39}
                    />
                    <Image
                      alt='Icon of a house'
                      src='/images/house.svg'
                      width={44}
                      height={39}
                    />
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  'flex flex-col items-center justify-between gap-4 p-4 h-[calc(100%_-_5rem)] pt-2',
                  {
                    hidden: index !== currentIndex,
                  },
                )}
              >
                <div>
                  {question.category && <h1 className='font-bold text-xl text-center'>{question.category.name}</h1>}
                  <h2 className='text-center'>{question.question}</h2>
                </div>
                {answerData && agree != null && rating != null && (
                  <div className='grid grid-cols-1 w-full h-16'>
                    <div className='flex text-[#7A7DB7] font-bold -mt-4'>USA</div>
                    <div className='flex h-full gap-4'>
                      <div className='w-16'>
                        Yes <span className='text-xs'>({answerData.yesCount})</span>
                      </div>
                      <div className='flex-1 flex items-center h-full'>
                        <div className='w-full relative h-4 overflow-hidden rounded-full'>
                          <div
                            className='bg-gradient-to-tr from-[#899ED4] to-[#A389D4] h-full rounded-full absolute top-0 left-0 z-0'
                            style={{
                              width: `${(+answerData.yesCount / (+answerData.yesCount + +answerData.noCount)) * 100}%`,
                            }}
                          />
                          <div className='w-full h-full border rounded-full border-neutral-300 bg-transparent shadow-[inset_0_1px_1px_1px_rgba(0,_0,_0,_0.5)] absolute top-0 left-0 z-10'>
                            <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center text-xs font-bold'>
                              {Math.round(
                                (+answerData.yesCount / (+answerData.yesCount + +answerData.noCount)) * 10000,
                              ) / 100}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex h-full gap-4'>
                      <div className='w-16'>
                        No <span className='text-xs'>({answerData.noCount})</span>
                      </div>
                      <div className='flex-1 flex items-center h-full'>
                        <div className='w-full relative h-4 overflow-hidden rounded-full'>
                          <div
                            className='bg-gradient-to-tr from-[#899ED4] to-[#A389D4] h-full rounded-full absolute top-0 left-0 z-0'
                            style={{
                              width: `${(+answerData.noCount / (+answerData.yesCount + +answerData.noCount)) * 100}%`,
                            }}
                          />
                          <div className='w-full h-full border rounded-full border-neutral-300 bg-transparent shadow-[inset_0_1px_1px_1px_rgba(0,_0,_0,_0.5)] absolute top-0 left-0 z-10'>
                            <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center text-xs font-bold'>
                              {Math.round(
                                (+answerData.noCount / (+answerData.yesCount + +answerData.noCount)) * 10000,
                              ) / 100}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!(answerData && agree != null && rating != null) && <div className='w-full h-16' />}
                <div className='flex flex-col gap-4'>
                  <div className='flex justify-center gap-4'>
                    <Button
                      className={classNames('rounded-full text-2xl h-16 w-16', {
                        'outline outline-4 outline-offset-2 outline-[#6932D1]': agree === true,
                      })}
                      onClick={() => setAgree(agree === true ? null : true)}
                    >
                      Yes
                    </Button>
                    <Button
                      className={classNames('rounded-full text-2xl h-16 w-16', {
                        'outline outline-4 outline-offset-2 outline-[#6932D1]': agree === false,
                      })}
                      onClick={() => setAgree(agree === false ? null : false)}
                    >
                      No
                    </Button>
                  </div>
                  <div className='grid grid-cols-5 gap-4'>
                    <div className='flex flex-col items-center gap-2'>
                      <Button
                        className={classNames('rounded-full text-2xl h-12 w-12', {
                          'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 1,
                        })}
                        onClick={() => setRating(rating === 1 ? null : 1)}
                      >
                        1
                      </Button>
                      <span className='text-neutral-500 text-xl'>Least</span>
                    </div>
                    <div>
                      <Button
                        className={classNames('rounded-full text-2xl h-12 w-12', {
                          'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 2,
                        })}
                        onClick={() => setRating(rating === 2 ? null : 2)}
                      >
                        2
                      </Button>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                      <Button
                        className={classNames('rounded-full text-2xl h-12 w-12', {
                          'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 3,
                        })}
                        onClick={() => setRating(rating === 3 ? null : 3)}
                      >
                        3
                      </Button>
                      <span className='text-neutral-500 text-xl'>Some</span>
                    </div>
                    <div>
                      <Button
                        className={classNames('rounded-full text-2xl h-12 w-12', {
                          'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 4,
                        })}
                        onClick={() => setRating(rating === 4 ? null : 4)}
                      >
                        4
                      </Button>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                      <Button
                        className={classNames('rounded-full text-2xl h-12 w-12 !p-0', {
                          'outline outline-4 outline-offset-2 outline-[#6932D1]': rating === 5,
                        })}
                        onClick={() => setRating(rating === 5 ? null : 5)}
                      >
                        <BsStarFill />
                      </Button>
                      <span className='text-neutral-500 text-xl'>Most</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4'>
                    <Button
                      className='text-2xl'
                      disabled={agree === undefined || agree === null || rating === undefined || rating === null}
                      onClick={async () => {
                        const newAnswers = [...answers];
                        newAnswers[index].agree = agree;
                        newAnswers[index].rating = rating;
                        newAnswers[index].skipped = false;
                        setAnswers(newAnswers);
                        let nextIndex = questions.findIndex(
                          (q) =>
                            q.id !== question.id &&
                            answers.find(
                              (a) =>
                                a.questionId === q.id &&
                                (a.agree === undefined ||
                                  a.agree === null ||
                                  a.rating === undefined ||
                                  a.rating === null) &&
                                !a.skipped,
                            ),
                        );
                        if (nextIndex === -1 && currentIndex < questions.length - 1) {
                          nextIndex = currentIndex + 1;
                        }
                        if (nextIndex >= 0 && nextIndex < questions.length) {
                          setCurrentIndex(nextIndex);
                          setAgree(answers[nextIndex].agree);
                          setRating(answers[nextIndex].rating);
                        } else {
                          if (!session?.user) {
                            localStorage.setItem('poll', JSON.stringify(newAnswers));
                            router.push('/account-needed');
                          } else {
                            (async () => {
                              await savePoll(session?.user, answers);
                              router.push('/candidate-matches');
                            })().catch(console.error);
                          }
                        }
                      }}
                    >
                      Continue
                    </Button>
                    <div className='grid grid-cols-2 gap-4'>
                      <Button
                        buttonType='flat-black'
                        disabled={currentIndex === 0}
                        onClick={() => {
                          setCurrentIndex(currentIndex - 1);
                          setAgree(answers[currentIndex - 1].agree);
                          setRating(answers[currentIndex - 1].rating);
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        buttonType='flat-black'
                        disabled={agree != null && rating != null}
                        onClick={async () => {
                          const newAnswers = [...answers];
                          newAnswers[index].agree = null;
                          newAnswers[index].rating = null;
                          newAnswers[index].skipped = true;
                          setAnswers(newAnswers);
                          let nextIndex = questions.findIndex(
                            (q) =>
                              q.id !== question.id &&
                              answers.find(
                                (a) =>
                                  a.questionId === q.id &&
                                  (a.agree === undefined ||
                                    a.agree === null ||
                                    a.rating === undefined ||
                                    a.rating === null) &&
                                  !a.skipped,
                              ),
                          );
                          if (nextIndex === -1 && currentIndex < questions.length - 1) {
                            nextIndex = currentIndex + 1;
                          }
                          if (nextIndex >= 0 && nextIndex < questions.length) {
                            setCurrentIndex(nextIndex);
                            setAgree(answers[nextIndex].agree);
                            setRating(answers[nextIndex].rating);
                          } else {
                            setAnswers((answers) => {
                              if (!session?.user) {
                                localStorage.setItem('poll', JSON.stringify(newAnswers));
                                router.push('/account-needed');
                              } else {
                                (async () => {
                                  await savePoll(session?.user, answers);
                                  router.push('/candidate-matches');
                                })().catch(console.error);
                              }
                              return answers;
                            });
                          }
                        }}
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </section>
  );
}
