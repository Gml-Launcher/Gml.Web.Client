import type { Metadata } from 'next';

import { SettingsPage } from '@/views/settings';

export const metadata: Metadata = {
  title: 'Настройки',
};
const Page = async () => {
  return <SettingsPage />;
};
export default Page;
