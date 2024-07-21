import Button from '@/components/atoms/button';
import GAConversion from '@/components/atoms/ga-conversion';
import MainCard from '@/components/atoms/main-card';
import authOptions from '@/utils/auth-options';
import { getUser } from '@/utils/server-actions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = await getUser(session?.user);

  if (!user) {
    redirect('/');
  }

  return (
    <MainCard>
      <GAConversion user={user} />
      <div className='grid grid-cols-1 gap-4 p-4'>
        <div className='text-center'>
          Thank you for registering!
          <br />
          Please proceed to the poll to find your candidate matches.
        </div>
        <div className='text-center'>
          <Button
            isLink
            href='/poll'
          >
            Take the poll
          </Button>
        </div>
      </div>
    </MainCard>
  );
}
