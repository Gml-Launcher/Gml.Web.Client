"use client";

import React from "react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

import { useConnectionHub } from "../lib/useConnectionHub";
import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { Textarea } from "@/shared/ui/textarea";
import { Icons } from "@/shared/ui/icons";

interface DownloadClientHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

export function DownloadClientHub(props: DownloadClientHubProps) {
  const {
    onDownloadDistributive,
    onBuildDistributive,
    isDisable,
    isPacked,
    progress,
    fullProgress,
    logs,
  } = useConnectionHub(props);

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
            {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
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
            {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Собрать
          </Button>
        </div>
      </div>
      {Boolean(isDisable) && (
        <div className="grid gap-y-4">
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-1 w-96">
              <h6 className="text-sm font-bold">Прогресс</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Выполнено на {progress}% из 100%
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-[32rem]">
              <Progress className="h-2" value={progress} />
            </div>
          </div>
          {Boolean(isPacked) && (
            <div>
              <div className="flex gap-x-8">
                <div className="flex flex-col gap-y-1 w-96">
                  <h6 className="text-sm font-bold">Полный прогресс</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Выполнено на {fullProgress}% из 100%
                  </p>
                </div>
                <div className="flex flex-col gap-y-1 w-[32rem]">
                  <Progress className="h-2" value={fullProgress} />
                </div>
              </div>
              <Textarea value={logs.join("\n")} className="h-64 max-h-64" readOnly />
            </div>
          )}
        </div>
      )}
    </>
  );
}
