import MainCard from '@/components/atoms/main-card';
import Poll from '@/components/molecules/poll';
import { getPoll } from '@/utils/server-actions';

export default async function Page() {
  const questions = await getPoll();

  return (
    <MainCard>
      <Poll questions={questions} />
    </MainCard>
  );
}
