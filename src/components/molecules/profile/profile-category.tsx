'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { useRouter } from 'next/navigation';
import { calculateRateFromScore } from '@/utils/calc';
import { getAnswerForSingleCategory, getCandidateSingleCategoryAnswerScore } from '@/utils/server-actions';
import { SingleSkeleton, LabelSkeleton } from '../skeleton/single';

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
    id,
    categoryId,
}: {
    id?: string,
    categoryId?: string,
}) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Answer[]>();
    const [username, setUsername] = useState<string | null>();
    const [category, setCategory] = useState<string | null>();
    const [score, setScore] = useState<number>();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getAnswers() {
            if (id && categoryId) {
                const {currentUser, category, answers} = await getAnswerForSingleCategory(id, categoryId);
                const score = await getCandidateSingleCategoryAnswerScore(id, categoryId);

                setAnswers(answers);
                setUsername(currentUser.name);
                setCategory(category?.name);
                setScore(score);
                setLoading(false);
            }
            return;
        }
        getAnswers();
    }, [id, categoryId]);

    const goCategories = () => {
        router.back();
    }

    const dateToFormattedString = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const AnswerElement = (answer: Answer) => {
        return (
            <div className='flex flex-col gap-1 py-4 font-light'>
                <div className='flex flex-col justify-between gap-6 p-4 min-h-[80px]' style={{background: "linear-gradient(-45deg, #7E8287, #474B4F"}}>
                    <div className='text-lg text-white'>
                        {answer.question}
                    </div>
                </div>
                <div className='p-2'>
                    <div className='text-lg font-normal'>
                        {dateToFormattedString(answer.dateUpdated)}
                    </div>
                    <ol className="relative border-s border-gray-200 dark:border-gray-700">  
                        <li className="my-2 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" style={{background: answer.agree ? "linear-gradient(0deg, #69F7A5, #22C064" : "linear-gradient(0deg, #7E8287, #474B4F"}}></div>
                            <div>
                                <div className='text-lg'>
                                    {answer.agree ? "Yes" : "No"}
                                </div>
                                {answer.notes && (<div className='text-lg font-light'>
                                    &ldquo;{answer.notes}&rdquo;
                                </div>)}
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-between gap-2 p-4'>
            <div className='text-4xl font-light	py-4'>
                {loading && <LabelSkeleton len={200} height={10}/>}
                {username}&apos;s Answers
            </div>

            <Button onClick={goCategories} className='text-sm uppercase w-fit m-auto'>
                Answer Categories
            </Button>

            <div className='p-4'>
                <div className='text-2xl font-light'>
                    {category}
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='text-lg font-light flex items-center'>
                        {Math.round(score || 0)}% Similar
                    </div>
                    <Star rate={calculateRateFromScore(score)} />
                </div>
            </div>

            {loading && <SingleSkeleton />}
            {answers?.map((answer: Answer) => (
                <div key={answer.id}>
                    {AnswerElement(answer)}
                </div>
            ))}
        </div>
    );
}
