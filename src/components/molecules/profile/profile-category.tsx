'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { signOut } from 'next-auth/react';
import ProfileAnswer from './profile-answer';
import { useRouter, usePathname } from 'next/navigation';
import { calculateRateFromScore } from '@/utils/calc';
import { getAnswerForSingleCategory } from '@/utils/server-actions';

type Answer = {
    id: string;
    questionId: string;
    agree: boolean | null;
    rating: number | null;
    notes: string | null;
    dateUpdated: Date;
    question: string | null;
}

export default function ProfileCategory({
    title,
    score,
    email,
    categoryId,
}: {
    title?: string,
    score?: number | null,
    email?: string,
    categoryId?: string,
}) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Answer[]>();

    useEffect(() => {
        async function getAnswers() {
            if (email && categoryId) {
                const answers = await getAnswerForSingleCategory(email, categoryId);
                setAnswers(answers);
            }
            return;
        }
        getAnswers();
    }, [email, categoryId]);

    const goCategories = () => {
        router.push('/profile')
    }

    const dateToFormattedString = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const AnswerElement = (answer: Answer) => {
        return (
            <div className='flex flex-col gap-1 py-4 font-light'>
                <div className='flex flex-col justify-between gap-6 p-4' style={{background: "linear-gradient(-45deg, #7E8287, #474B4F"}}>
                    <div className='text-lg text-white'>
                        {answer.question}
                    </div>
                </div>
                <div className='p-2'>
                    <div className='text-lg font-normal'>
                        {dateToFormattedString(answer.dateUpdated)}
                    </div>
                    <div className='text-lg'>
                        {answer.agree ? "Yes" : "No"}
                    </div>
                    {answer.notes && (<div className='text-lg'>
                        {answer.notes}
                    </div>)}
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-between gap-2 p-4'>
            <div className='text-4xl font-light	py-4'>
                Lincoln&apos;s Answers
            </div>

            <Button onClick={goCategories} className='text-sm uppercase'>
                Answer Categories
            </Button>

            <div className='p-4'>
                <div className='text-2xl font-light'>
                    {title}
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <div className='text-lg font-light'>
                      {Math.round(score || 0)}% Similar
                  </div>
                  <Star rate={calculateRateFromScore(score)} />
                </div>
            </div>

            {answers?.map((answer: Answer) => (
                <div key={answer.id}>
                    {AnswerElement(answer)}
                </div>
            ))}
        </div>
    );
}
