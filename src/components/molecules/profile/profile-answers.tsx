'use client';

import { useState, ChangeEvent } from 'react';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { signOut } from 'next-auth/react';
import ProfileAnswer from './profile-answer';


export default function ProfileAnswers({
  completenessWithScore
}: {
  completenessWithScore?: {
    similarityScore: number;
    name: string | null;
    categoryId: string;
    totalQuestions: string | number | bigint;
    answeredQuestions: string | number | bigint | null;
  }[];
}) {
  return (
    <div className='flex flex-col justify-between gap-2 p-4'>
        <div className='text-4xl font-light	py-2'>
            Lincoln&apos;s Answers
        </div>
        <div className='py-4'>
          {completenessWithScore?.map(category => (
              <ProfileAnswer data={category} key={category.categoryId}/>
          ))}
        </div>
        
    </div>
  );
}
