"use client";

import React, { useEffect, useRef } from "react";

import { Ubuntu_Mono } from "next/font/google";

import { ProfileExtendedBaseEntity, RestoreProfileSchemaType } from "@/shared/api/contracts";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Textarea } from "@/shared/ui/textarea";
import { Icons } from "@/shared/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

import { useConnectionHub } from "../lib/useConnectionHub";
import { useGetJavaVersions } from "@/shared/hooks";
import { SubmitHandler, useForm } from "react-hook-form";

interface DownloadClientHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

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

  const javaVersions = useGetJavaVersions();

  javaVersions.data?.data.sort((a, b) => b.majorVersion - a.majorVersion);

  const form = useForm<RestoreProfileSchemaType>({
    defaultValues: {
      javaVersion: {
        name: "По умолчанию",
        version: "По умолчанию",
        majorVersion: 30,
      },
    },
  });

  const onSubmit: SubmitHandler<RestoreProfileSchemaType> = async (
    data: RestoreProfileSchemaType,
  ) => {
    console.log(data.javaVersion);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
        <div className="flex flex-col gap-y-6">
          {/* Управление */}
          <h5 className="text-xl font-bold">Управление</h5>
          <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Карточка 1 шаг */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm justify-between p-6 gap-3">
                  <h6 className="text-xl font-bold">Шаг первый</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Необходимо загрузить клиент
                  </p>
                  <FormField
                    control={form.control}
                    name="javaVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Выберите версию Java*</FormLabel>
                        <FormControl>
                          <Select defaultValue="По умолчанию">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите версию java" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {javaVersions.data &&
                                javaVersions.data.data.map(({ version }, i) => (
                                  <SelectItem key={i} value={version}>
                                    Java: {version}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-fit font-semibold"
                    disabled={isDisable || !props.profile || !props.profile.hasUpdate}
                  >
                    {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Загрузить
                  </Button>
                </div>
              </form>
            </Form>

            {/* Карточка 2 шаг */}
            <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm justify-between p-6 gap-3">
              <h6 className="text-xl font-bold">Шаг второй</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Необходимо собрать профиль</p>
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
        </div>
        <div className="flex flex-col gap-y-6">
          <h5 className="text-xl font-bold">Консоль</h5>
          <Textarea
            ref={textareaRef}
            value={logs ? logs.join("\n") : ""}
            className={cn("h-80 max-h-80 font-sans", ubuntuMono.variable)}
            readOnly
          />

          {isDisable && !isPacked && (
            <div className="flex gap-x-2 items-center">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              <span>Подключение к консоли...</span>
            </div>
          )}

          {Boolean(isDisable) && (
            <div className="grid gap-y-4">
              {Boolean(isPacked) && logs && (
                <div>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <span>{percentStage}%</span>
                        <span>Общий прогресс: {percentAllStages}%</span>
                      </div>
                      <div className="relative">
                        <Progress className="h-2 absolute opacity-70" value={percentStage} />
                        <Progress className="h-2 absolute opacity-50" value={percentAllStages} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
