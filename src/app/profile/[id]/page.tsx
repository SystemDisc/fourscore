'use client'

import Button from '@/components/atoms/button';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import { useSearchParams } from 'next/navigation'
import { getSession } from "next-auth/react"

import { redirect } from 'next/navigation';
import { getUserProfile, getCandidateAnswerScore } from '@/utils/server-actions';

import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileAnswers from '@/components/molecules/profile/profile-answers';
import { useEffect, useState } from 'react';


export default function Page({
    params
}: {
    params: { id: string }
}) {
  const [profile, setProfile] = useState<any>(null);
  const [completenessWithScore, setCompletenessWithScore] = useState<any>(null);

  useEffect(() => {
    const id = params.id;
    async function fetchProfile() {
      if (!id) {
        return;
      }
      // const data = await getPollFromId(id);
      const profile = await getUserProfile(undefined, id);
      const completenessWithScore = await getCandidateAnswerScore(id);

      setProfile(profile);
      setCompletenessWithScore(completenessWithScore);
    }

    fetchProfile()
  }, [params])


  return (
    <MainCard>
      <MainNav />
      <ProfileBanner />
      <ProfileAnswers />
    </MainCard>
  );
}
