import type { Metadata } from 'next';

import { ProfilesPage } from '@/views/profiles';

export const metadata: Metadata = {
  title: 'Профили',
};
const Page = async () => {
  return <ProfilesPage />;
};
export default Page;
