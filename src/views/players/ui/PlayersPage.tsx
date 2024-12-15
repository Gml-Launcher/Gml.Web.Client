'use client';

import { DASHBOARD_PAGES } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { PlayersTable } from '@/widgets/players-table/ui/PlayersTable';

export const PlayersPage = () => {
  return (
    <>
      <Breadcrumbs
        current={'Игроки'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />

      <PlayersTable />
    </>
  );
};
