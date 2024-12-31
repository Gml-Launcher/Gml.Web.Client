import type { Metadata } from 'next';

import { SentryPage } from '@/views/sentry';

export const metadata: Metadata = {
  title: 'Ошибки',
};
const Page = async () => {
  return <SentryPage />;
};
export default Page;
