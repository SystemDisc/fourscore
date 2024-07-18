'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Button from '@/components/atoms/button';
import Star from '@/components/atoms/star';
import { signOut } from 'next-auth/react';
import ProfileAnswer from './profile-answer';
import { useParams } from 'next/navigation'
import { getUserProfile, getCandidateAnswerScore } from '@/utils/server-actions';

export default function ProfileAnswers() {
  const params = useParams()

  const [profile, setProfile] = useState<any>(null);
  const [completenessWithScore, setCompletenessWithScore] = useState<{
    similarityScore: number;
    name: string | null;
    categoryId: string;
    totalQuestions: string | number | bigint;
    answeredQuestions: string | number | bigint | null;
  }[]>(new Array());

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id || typeof(params.id) != 'string') {
        return;
      }
      const profile = await getUserProfile(undefined, params.id);
      const completenessWithScore = await getCandidateAnswerScore(params.id);
      setProfile(profile);
      setCompletenessWithScore(completenessWithScore);
    }
    fetchProfile()
  }, [params])

  return (
    <div className='flex flex-col justify-between gap-2 p-4'>
        <div className='text-4xl font-light	py-2'>
            {profile?.name}&apos;s Answers
        </div>
        <div className='py-4'>
          {completenessWithScore?.map(category => (
              <ProfileAnswer data={category} key={category.categoryId}/>
          ))}
        </div>
    </div>
  );
}
