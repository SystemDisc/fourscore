'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import ProfileAnswer from './profile-answer';
import { useParams } from 'next/navigation'
import { getUserProfile, getCandidateAnswerScore } from '@/utils/server-actions';
import { LabelSkeleton, SingleSkeleton } from '@/components/molecules/skeleton/single';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id || typeof(params.id) != 'string') {
        return;
      }
      const profile = await getUserProfile(undefined, params.id);
      const completenessWithScore = await getCandidateAnswerScore(params.id);
      setProfile(profile);
      setCompletenessWithScore(completenessWithScore);
      setLoading(false);
    }
    fetchProfile()
  }, [params])

  return (
    <div className='flex flex-col justify-between gap-2 p-4'>
        <div className='text-4xl font-light	py-2'>
            {profile?.name}&apos;s Answers
        </div>
        <div className='py-4'>
          {loading ?
            Array.from({length: 5}, (v, k) => k + 1).map((id) => (
              <div className="border mb-2 rounded-md shadow p-2" key={id}>
                <SingleSkeleton/>
              </div>
            ))
            :
            completenessWithScore?.map(category => (
                <ProfileAnswer data={category} key={category.categoryId}/>
            ))
          }
        </div>
    </div>
  );
}
