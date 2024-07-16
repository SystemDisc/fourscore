'use client'

import Button from '@/components/atoms/button';
import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import authOptions from '@/utils/auth-options';
import { getSession } from "next-auth/react"

import { redirect } from 'next/navigation';
import { getUserProfile, getPollFromEmail, calculateMatches } from '@/utils/server-actions';

import Disclaimer from '@/components/atoms/disclaimer';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileAnswers from '@/components/molecules/profile/profile-answers';
import { useEffect, useState } from 'react';
import { match } from 'assert';


export default function Page() {
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<any>(null);
  const [allAnswers, setAllAnswers] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const session = await getSession()
      const email = session?.user?.email;

      if (!email) {
        return;
      }
      const data = await getPollFromEmail(email);
      const profile = await getUserProfile(email);

      setProfile(profile);
      setQuestions(data.questions);
      setAllAnswers(data.allAnswers);
    }

    fetchProfile()
  }, [])


  return (
    <MainCard>
      <MainNav />
      <ProfileBanner profile={profile?.currentUser} />
      <ProfileAnswers completenessWithScore={profile?.completenessWithScore} />
    </MainCard>
  );
}
