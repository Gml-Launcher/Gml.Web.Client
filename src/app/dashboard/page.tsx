import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DASHBOARD_PAGES } from '@/shared/routes';

export const metadata: Metadata = {
  title: 'Дашборд',
};

export default async function DashboardPage() {
  redirect(DASHBOARD_PAGES.PROFILES);
}
