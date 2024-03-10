import Button from '@/components/atoms/button';
import Loading from '@/components/atoms/loading';
import MainCard from '@/components/atoms/main-card';
import ConfirmAddress from '@/components/molecules/confirm-address';
import { NewAddress } from '@/db/database';
import { notificationContext } from '@/providers/notification-provider';
import authOptions from '@/utils/auth-options';
import { saveAddress } from '@/utils/server-actions';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { cookies } from 'next/headers';
import { redirect, useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';

export default async function Page() {
  const session = await getServerSession(authOptions);

  const cookieStore = cookies();
  const addressString = cookieStore.get('confirmedAddress')?.value;
  if (addressString && session) {
    const address = JSON.parse(addressString);
    await saveAddress(session.user, address);

    redirect('/poll');
  }
  return (
    <MainCard>
      <ConfirmAddress />
    </MainCard>
  );
}
