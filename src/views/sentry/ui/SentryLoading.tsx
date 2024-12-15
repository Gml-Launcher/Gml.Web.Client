import { DASHBOARD_PAGES } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';

export const SentryLoading = () => {
  return (
    <>
      <Breadcrumbs
        current={'Ошибки'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />
      Loading...
    </>
  );
};
