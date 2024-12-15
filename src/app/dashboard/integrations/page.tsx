import type { Metadata } from 'next';

import { IntegrationsPage } from '@/views/integrations';

export const metadata: Metadata = {
  title: 'Интеграции',
};
const Page = async () => {
  return <IntegrationsPage />;
};
export default Page;
