"use client";

import React from "react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

import { useConnectionHub } from "../lib/useConnectionHub";

interface DownloadClientHubProps {
  profileName: string;
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
          <p className="text-sm text-gray-700">Необходимо загрузить клиент</p>
        </div>
        <div className="flex flex-col gap-y-1 w-[32rem]">
          <Button className="w-fit" onClick={onDownloadDistributive} disabled={isDisable}>
            Загрузить
          </Button>
        </div>
      </div>
      <div className="flex gap-x-8">
        <div className="flex flex-col gap-y-1 w-96">
          <h6 className="text-sm font-bold">Шаг второй</h6>
          <p className="text-sm text-gray-700">Необходимо собрать профиль</p>
        </div>
        <div className="flex flex-col gap-y-1 w-[32rem]">
          <Button className="w-fit" onClick={onBuildDistributive} disabled={isDisable}>
            Собрать
          </Button>
        </div>
      </div>
      {Boolean(progress) && (
        <div className="flex gap-x-8">
          <div className="flex flex-col gap-y-1 w-96">
            <h6 className="text-sm font-bold">Прогресс</h6>
            <p className="text-sm text-gray-700">Выполнено на {progress}% из 100%</p>
          </div>
          <div className="flex flex-col gap-y-1 w-[32rem]">
            <Progress className="h-2" value={progress} />
          </div>
        </div>
      )}
    </>
  );
}
