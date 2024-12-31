import type { Metadata } from 'next';

import { PlayersPage } from '@/views/players';

export const metadata: Metadata = {
  title: 'Игроки',
};

const Page = () => {
  return <PlayersPage />;
};

export default Page;
