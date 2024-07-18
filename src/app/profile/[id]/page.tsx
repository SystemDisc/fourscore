import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';

import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileAnswers from '@/components/molecules/profile/profile-answers';

export default function Page() {
  return (
    <MainCard>
      <MainNav />
      <ProfileBanner />
      <ProfileAnswers />
    </MainCard>
  );
}
