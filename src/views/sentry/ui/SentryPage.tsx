"use client"

import {DASHBOARD_PAGES} from "@/shared/routes";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";
import {useSentryErrors} from "@/shared/hooks";
import {SentryLoading} from "@/views/sentry/ui/SentryLoading";

export const SentryPage = () => {

  const {data, isSuccess} = useSentryErrors()

  if (!data) return <SentryLoading/>

  return (
    <>
      <Breadcrumbs
        current={"Sentry"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
    </>
  );
};
