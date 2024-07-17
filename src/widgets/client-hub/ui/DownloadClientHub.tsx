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
import { FormCombobox } from "@/shared/ui/FormCombobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";

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
    onDownloadJavaDistributive,
    onBuildDistributive,
    isDisable,
    isPacked,
    percentStage,
    percentAllStages,
    logs,
  } = useConnectionHub(props);

  const javaVersions = useGetJavaVersions();

  if (!javaVersions.isLoading) {
    javaVersions.data?.data.push({
      name: "По умолчанию",
      version: "По умолчанию",
      majorVersion: 30,
    });
  }
  javaVersions.data?.data.sort((a, b) => b.majorVersion - a.majorVersion);

  const form = useForm<RestoreProfileSchemaType>({
    defaultValues: {},
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-[200px] justify-between"
                              >
                                {field.value
                                  ? `Java: ${
                                      javaVersions.data?.data.find(
                                        (version) => version.version === field.value.version,
                                      )?.version
                                    }`
                                  : "Выберите версию Java"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                <CommandInput placeholder="Поиск версий..." />
                                <CommandList>
                                  <CommandEmpty>No language found.</CommandEmpty>
                                  <CommandGroup>
                                    {javaVersions.data &&
                                      javaVersions.data.data.map((version, i) => (
                                        <CommandItem
                                          value={`Java: ${version.version}`}
                                          key={`${version.name}-${i}`}
                                          onSelect={() => {
                                            form.setValue("javaVersion", version);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              version === field.value ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          Java: {version.version}
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
