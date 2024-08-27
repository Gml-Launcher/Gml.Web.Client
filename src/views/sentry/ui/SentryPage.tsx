import { DASHBOARD_PAGES } from "@/shared/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

export const SentryPage = () => {
  return (
    <>
      <Breadcrumbs
        current={"Sentry"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
    </>
  );
};
