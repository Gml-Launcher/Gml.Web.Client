"use client"

import {DASHBOARD_PAGES} from "@/shared/routes";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";
import {useSentryErrors} from "@/shared/hooks";
import {SentryLoading} from "@/views/sentry/ui/SentryLoading";
import {SentryChart} from "@/widgets/sentry-chart";

export const SentryPage = () => {

  const {data} = useSentryErrors()

  if (!data) return <SentryLoading/>

  return (
    <>
      <Breadcrumbs
        current={"Sentry"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="flex gap-6 items-start">
        {data.data.bugs.map(({graphics, exception}) => (
          <div key={exception}>
            <SentryChart graphics={graphics}/>
          </div>
        ))}
      </div>
    </>
  );
};
