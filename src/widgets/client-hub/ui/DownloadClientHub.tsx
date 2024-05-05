"use client";

import React from "react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

import { useConnectionHub } from "../lib/useConnectionHub";
import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";

interface DownloadClientHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

export function DownloadClientHub(props: DownloadClientHubProps) {
  const { onDownloadDistributive, onBuildDistributive, isDisable, progress } =
    useConnectionHub(props);

  return (
    <>
      <div className="flex gap-x-8">
        <div className="flex flex-col gap-y-1 w-96">
          <h6 className="text-sm font-bold">Шаг первый</h6>
          <p className="text-sm text-gray-700 dark:text-gray-300">Необходимо загрузить клиент</p>
        </div>
        <div className="flex flex-col gap-y-1 w-[32rem]">
          <Button
            className="w-fit"
            onClick={onDownloadDistributive}
            disabled={isDisable || !props.profile || !props.profile.hasUpdate}
          >
            Загрузить
          </Button>
        </div>
      </div>
      <div className="flex gap-x-8">
        <div className="flex flex-col gap-y-1 w-96">
          <h6 className="text-sm font-bold">Шаг второй</h6>
          <p className="text-sm text-gray-700 dark:text-gray-300">Необходимо собрать профиль</p>
        </div>
        <div className="flex flex-col gap-y-1 w-[32rem]">
          <Button
            className="w-fit"
            onClick={onBuildDistributive}
            disabled={isDisable || !props.profile || !props.profile.hasUpdate}
          >
            Собрать
          </Button>
        </div>
      </div>
      {Boolean(progress) && (
        <div className="flex gap-x-8">
          <div className="flex flex-col gap-y-1 w-96">
            <h6 className="text-sm font-bold">Прогресс</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">Выполнено на {progress}% из 100%</p>
          </div>
          <div className="flex flex-col gap-y-1 w-[32rem]">
            <Progress className="h-2" value={progress} />
          </div>
        </div>
      )}
    </>
  );
}
