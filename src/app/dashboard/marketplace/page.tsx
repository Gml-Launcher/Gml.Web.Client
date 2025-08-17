import type { Metadata } from 'next';

import { MarketplacePage } from '@/views/marketplace';

export const metadata: Metadata = {
  title: 'Маркетплейс',
};

const Page = async () => {
  return <MarketplacePage />;
};

export default Page;