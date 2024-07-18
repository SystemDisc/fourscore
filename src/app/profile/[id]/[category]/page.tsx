import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import ProfileBanner from '@/components/molecules/profile/profile-banner';
import ProfileCategory from '@/components/molecules/profile/profile-category';

export default function Page({
  params
}: {
  params: {
    id: string, category: string
  }
}) {
  return (
    <MainCard>
      <MainNav />
      <ProfileBanner />
      <ProfileCategory 
        id={params.id}
        categoryId={params?.category}
      />
    </MainCard>
  );
}
