'use client';

import classNames from 'classnames';
import { useState } from 'react';
import Button from '../atoms/button';
import { BsStarFill } from 'react-icons/bs';

interface Answer {
  agree?: boolean;
  rating?: number;
}

export default function Poll({
  questions,
}: {
  questions: {
    id: string;
    localityId: string;
    categoryId: string;
    question: string;
    locality: {
      id: string;
      name: string;
      position: number | null;
    } | null;
    category: {
      id: string;
      name: string;
    } | null;
  }[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [agree, setAgree] = useState<boolean>();
  const [rating, setRating] = useState<number>();
  const [answers, setAnswers] = useState<Answer[]>(questions.map(() => ({})));

  return (
    <section className='grid grid-cols-1'>
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div>
          <Button buttonType='flat' className='w-full' disabled={currentIndex === 0}>
            Back
          </Button>
        </div>
        <div>
          <Button buttonType='flat' className='w-full'>
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
          className={classNames('min-h-[calc(100dvh_-_5rem_-_44px)]', {
            'hidden': index !== currentIndex,
          })}
        >
          <div className='h-32 bg-gradient-to-bl from-[#6932D1] to-[#899ED4] flex items-end justify-between p-4'>
            <div className='text-7xl text-white'>
              {question.locality?.name}
            </div>
            <div className='grid grid-cols-3 gap-4 pb-1'>
              <img src='/images/house.svg' width={88} height={78} />
              <img src='/images/house.svg' width={88} height={78} />
              <img src='/images/house.svg' width={88} height={78} />
            </div>
          </div>
          <div
            className={classNames('flex flex-col items-center justify-center gap-4 p-4 h-[calc(100%_-_8rem)]', {
              'hidden': index !== currentIndex,
            })}
          >
            {question.category &&
              <h1 className='font-bold text-4xl'>
                {question.category.name}
              </h1>
            }
            <h2 className='text-2xl'>
              {question.question}
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <Button
                className={classNames('rounded-full text-4xl h-24 w-24', {
                  'outline outline-4 outline-offset-2 outline-[#6932D1]': agree === true
                })}
                onClick={() => setAgree(true)}
              >
                Yes
              </Button>
              <Button
                className={classNames('rounded-full text-4xl h-24 w-24', {
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
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[index].agree = agree;
                  newAnswers[index].rating = rating;
                  setAgree(undefined);
                  setRating(undefined);
                  setAnswers(newAnswers);
                  setCurrentIndex(currentIndex + 1);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}
