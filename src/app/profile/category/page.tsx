'use client'

import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import { useState, useEffect } from 'react';
import ProfileCategory from '@/components/molecules/profile/profile-category';

type categoryPageState = {
  categoryId: string,
  email: string,
  title: string,
  score: number | null,
}

export default function Page() {
  const myState = history.state;
  const [routeState, setRouteState] = useState<categoryPageState>();
  
  useEffect(() => {
    if (myState.email)
      setRouteState(myState);
  }, [myState]);

  return (
    <MainCard>
      <MainNav />
      <ProfileBanner />

      <ProfileCategory 
        title={routeState?.title}
        score={routeState?.score}
        email={routeState?.email}
        categoryId={routeState?.categoryId}
      />
    </MainCard>
  );
}
