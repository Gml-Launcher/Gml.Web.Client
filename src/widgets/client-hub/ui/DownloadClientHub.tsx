"use client";

import React, { useEffect, useRef } from "react";

import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Textarea } from "@/shared/ui/textarea";
import { Icons } from "@/shared/ui/icons";

import { useConnectionHub } from "../lib/useConnectionHub";

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
    percentStage,
    percentAllStages,
    logs,
  } = useConnectionHub(props);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs]);

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
                Выполнено на {percentStage}% из 100%
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-[32rem]">
              <Progress className="h-2" value={percentStage} />
            </div>
          </div>
          {Boolean(isPacked) && logs && (
            <div>
              <div className="flex gap-x-8">
                <div className="flex flex-col gap-y-1 w-96">
                  <h6 className="text-sm font-bold">Полный прогресс</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Выполнено на {percentAllStages}% из 100%
                  </p>
                </div>
                <div className="flex flex-col gap-y-1 w-[32rem]">
                  <Progress className="h-2" value={percentAllStages} />
                </div>
              </div>
              <div className="my-4">
                <Textarea
                  ref={textareaRef}
                  value={logs.join("\n")}
                  className="h-64 max-h-64"
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
