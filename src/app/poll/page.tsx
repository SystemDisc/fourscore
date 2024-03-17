import MainCard from '@/components/atoms/main-card';
import Poll from '@/components/molecules/poll';
import authOptions from '@/utils/auth-options';
import { getPoll } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }
  const data = await getPoll(session?.user);

  return (
    <MainCard>
      <Poll questions={data.questions} allAnswers={data.allAnswers} />
    </MainCard>
  );
}
