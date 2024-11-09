"use client";

import React from "react";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Skeleton } from "@/shared/ui/skeleton";
import { DASHBOARD_PAGES } from "@/shared/routes";

import classes from "./styles.module.css";

export const ProfileLoading = () => {
  return (
    <>
      <Breadcrumbs
        current={"..."}
        breadcrumbs={[
          { value: "Главная", path: DASHBOARD_PAGES.HOME },
          {
            value: "Профили",
            path: DASHBOARD_PAGES.PROFILES,
          },
        ]}
      />

      <div className={classes.profile}>
        <Skeleton className="h-[230px]" />
      </div>

      <div className={classes.tabs}>
        <div className={classes.tabs__list}>
          <Skeleton className="w-[178px] h-[208px]" />
        </div>
        <div className={classes.tabs__content}>
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    </>
  );
};
