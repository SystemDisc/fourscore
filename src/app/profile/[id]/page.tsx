'use client'

import Button from '@/components/atoms/button';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import { useSearchParams } from 'next/navigation'
import { getSession } from "next-auth/react"

import { redirect } from 'next/navigation';
import { getUserProfile, getPollFromId, calculateMatches } from '@/utils/server-actions';

import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileAnswers from '@/components/molecules/profile/profile-answers';
import { useEffect, useState } from 'react';
import { match } from 'assert';


export default function Page({
    params
}: {
    params: { id: string }
}) {
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<any>(null);
  const [allAnswers, setAllAnswers] = useState<any>(null);

  useEffect(() => {
    const id = params.id;
    async function fetchProfile() {
      if (!id) {
        return;
      }
      const data = await getPollFromId(id);
      const profile = await getUserProfile(undefined, id);

      console.log(profile)

      setProfile(profile);
      setQuestions(data.questions);
      setAllAnswers(data.allAnswers);
    }

    fetchProfile()
  }, [params])


  return (
    <MainCard>
      <MainNav />
      <ProfileBanner profile={profile?.currentUser} />
      <ProfileAnswers completenessWithScore={profile?.completenessWithScore} />
    </MainCard>
  );
}
