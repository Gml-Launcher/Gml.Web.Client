"use client";

import React, { useEffect, useRef, useState } from "react";

import { Ubuntu_Mono } from "next/font/google";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";

import {
  JavaVersionBaseEntity,
  ProfileExtendedBaseEntity,
  RestoreProfileSchemaType,
} from "@/shared/api/contracts";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Textarea } from "@/shared/ui/textarea";
import { Icons } from "@/shared/ui/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Separator } from "@/shared/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useGetJavaVersions } from "@/shared/hooks";

import { useConnectionHub } from "../lib/useConnectionHub";

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
  const [javaVersionsOpen, setJavaVersionsOpen] = useState(false);
  const onOpenJavaVersionsChange = () => setJavaVersionsOpen((prev) => !prev);

  const {
    onDownloadDistributive,
    onDownloadJavaDistributive,
    onBuildDistributive,
    isDisable,
    isPacked,
    isConnected,
    percentStage,
    percentAllStages,
    logs,
  } = useConnectionHub(props);

  const javaVersions = useGetJavaVersions();

  const form = useForm<RestoreProfileSchemaType>();

  const onSubmit: SubmitHandler<RestoreProfileSchemaType> = async (
    data: RestoreProfileSchemaType,
  ) => {
    if (!data.javaVersion) {
      onDownloadDistributive();
      return;
    }

    const selectedJavaVersion = JSON.parse(data.javaVersion) as JavaVersionBaseEntity;
    onDownloadJavaDistributive(selectedJavaVersion);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <h5 className="flex items-center gap-x-3 text-xl font-bold">
          Управление
          {!isConnected && <sup className="text-xs text-gray-400">Подключение к консоли...</sup>}
        </h5>
        <div className="grid grid-rows-3 grid-cols-1 xl:grid-rows-2 xl:grid-cols-2 min-[1920px]:grid-cols-[400px_400px_1fr] min-[1920px]:grid-rows-1 gap-6">
          {/* Карточка 1 шаг */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm p-6 gap-3">
                <div className="flex flex-col gap-y-1">
                  <h6 className="text-xl font-bold">Шаг первый</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Необходимо загрузить клиент
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="javaVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите версию Java</FormLabel>
                      <FormControl>
                        <Popover open={javaVersionsOpen} onOpenChange={onOpenJavaVersionsChange}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full flex justify-between items-center"
                            >
                              <span className="truncate grow mr-2 text-start">
                                {field.value && (JSON.parse(field.value) as JavaVersionBaseEntity)
                                  ? `${(JSON.parse(field.value) as JavaVersionBaseEntity).name}@${(JSON.parse(field.value) as JavaVersionBaseEntity).version}`
                                  : "По умолчанию"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Command>
                              <CommandInput placeholder="Поиск версий..." />
                              <CommandList>
                                <CommandEmpty>Версия не найдена</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      form.resetField("javaVersion");
                                      onOpenJavaVersionsChange();
                                    }}
                                  >
                                    <div className="flex items-center gap-x-5">
                                      <div className="flex flex-col gap-y-1">
                                        <span className="font-bold">По умолчанию</span>
                                        <span className="text-muted-foreground">
                                          На выбор сервера
                                        </span>
                                      </div>
                                    </div>
                                  </CommandItem>
                                  <Separator className="my-2" />
                                  {javaVersions.data &&
                                    javaVersions.data.map((version, i) => (
                                      <CommandItem
                                        value={JSON.stringify(version)}
                                        key={`${version.name}-${version.version}-${i}`}
                                        onSelect={() => {
                                          field.onChange(JSON.stringify(version));
                                          onOpenJavaVersionsChange();
                                        }}
                                      >
                                        <div className="flex items-center gap-x-5">
                                          <span className="font-extrabold text-md">
                                            {version.majorVersion}
                                          </span>
                                          <div className="flex flex-col gap-y-1">
                                            <span className="font-bold">{version.name}</span>
                                            <span className="text-muted-foreground">
                                              {version.version}
                                            </span>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-x-2 mt-auto">
                  <Button
                    className="w-fit font-semibold"
                    disabled={
                      !isConnected || isDisable || !props.profile || !props.profile.hasUpdate
                    }
                  >
                    {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Загрузить
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {/* Карточка 2 шаг */}
          <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm justify-between p-6 gap-3">
            <div className="flex flex-col gap-y-1">
              <h6 className="text-xl font-bold">Шаг второй</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Необходимо собрать профиль</p>
            </div>

            <Button
              className="w-fit"
              onClick={onBuildDistributive}
              disabled={!isConnected || isDisable || !props.profile || !props.profile.hasUpdate}
            >
              {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Собрать
            </Button>
          </div>

          <div className="flex flex-col gap-y-4 col-span-1 xl:col-span-2 min-[1920px]:col-span-1">
            <Textarea
              ref={textareaRef}
              value={logs ? logs.join("\n") : ""}
              className={cn("h-80 max-h-80 font-sans", ubuntuMono.variable)}
              readOnly
            />
          </div>
        </div>

        {Boolean(isDisable) && Boolean(isPacked) && logs && (
          <div className="grid gap-y-4">
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
          </div>
        )}
      </div>
    </>
  );
}
