import { CreateProfileDialog } from '@/widgets/create-profile-dialog';
import { ProfilesTable } from '@/widgets/profiles-table';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { ProfilesCard } from '@/widgets/profiles-table/ui/ProfilesCard';

export const ProfilesPage = () => {
  return (
    <>
      <Breadcrumbs
        current={'Профили'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="flex flex-col items-start py-4">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold mb-8">Профили</h1>
          <CreateProfileDialog />
        </div>
        <div className="flex-col gap-y-6 w-full hidden md:flex">
          <ProfilesTable />
        </div>
        <div className="flex-col gap-y-6 w-full md:hidden">
          <ProfilesCard />
        </div>
      </div>
    </>
  );
};
