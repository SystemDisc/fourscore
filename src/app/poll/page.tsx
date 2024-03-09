import MainCard from '@/components/atoms/main-card';
import Poll from '@/components/molecules/poll';
import { getPoll } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }
  console.log(session);
  const questions = await getPoll(session?.user);

  return (
    <MainCard>
      <Poll questions={questions} />
    </MainCard>
  );
}
