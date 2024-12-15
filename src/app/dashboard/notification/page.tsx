import type { Metadata } from 'next';

import { NotificationPage } from '@/views/notification';

export const metadata: Metadata = {
  title: 'Уведомления',
};

const Page = () => {
  return <NotificationPage />;
};

export default Page;
