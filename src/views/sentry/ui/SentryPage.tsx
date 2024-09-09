"use client";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { SentryStats } from "@/widgets/sentry-stats";

export const SentryPage = () => {
  return (
    <>
      <Breadcrumbs
        current={"Sentry"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />

      <SentryStats />

      {/*<div className="flex gap-6 items-start">*/}
      {/*  {data &&*/}
      {/*    data.bugs.map(({ graphics, exception }) => (*/}
      {/*      <div key={exception}>*/}
      {/*        <SentryChart graphics={graphics} />*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*</div>*/}
    </>
  );
};
