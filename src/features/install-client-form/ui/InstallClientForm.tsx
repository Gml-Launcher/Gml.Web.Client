"use client";

import React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useGithubLauncherVersions } from "@/shared/hooks";
import { cn, getApiBaseUrl } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { Progress } from "@/shared/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useToast } from "@/shared/ui/use-toast";

import { InstallClientFormSchemaType, InstallClientSchema } from "../lib/static";
import { useConnectionHub } from "../lib/useConnectionHub";

interface InstallClientFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InstallClientForm({ className, ...props }: InstallClientFormProps) {
  const { connectionHub, process, percent } = useConnectionHub();
  const { data: branches } = useGithubLauncherVersions();
  const { toast } = useToast();

  const form = useForm<InstallClientFormSchemaType>({
    values: { branch: "", host: getApiBaseUrl() || "", folder: "" },
    resolver: zodResolver(InstallClientSchema),
  });

  const onSubmit: SubmitHandler<InstallClientFormSchemaType> = async (
    data: InstallClientFormSchemaType,
  ) => {
    process.onIsProcessingToggle();
    try {
      connectionHub?.invoke("Download", data.branch, data.host, data.folder);
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: JSON.stringify(error),
      });
    } finally {
      process.onIsProcessingToggle();
      percent.setProgressPercent(0);
    }
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите версию</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите версию" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches &&
                        branches.map(({ version }) => (
                          <SelectItem key={version} value={version}>
                            {version}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.branch && (
                  <FormMessage>{form.formState.errors.branch.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите URL к API</FormLabel>
                <FormControl>
                  <Input placeholder="Введите URL к API" {...field} />
                </FormControl>
                {form.formState.errors.host && (
                  <FormMessage>{form.formState.errors.host.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="folder"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите название папки</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название папки" {...field} />
                </FormControl>
                {form.formState.errors.folder && (
                  <FormMessage>{form.formState.errors.folder.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            {Boolean(percent.progressPercent) && percent.progressPercent !== 100 && (
              <p className="text-gray-800 text-sm">
                Сборка завершена на {percent.progressPercent}% из 100%
              </p>
            )}
            <Button className="w-fit ml-auto" disabled={process.isProcessing}>
              {process.isProcessing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Скачать исходники
            </Button>
          </div>
        </form>
      </Form>
      {Boolean(percent.progressPercent) && percent.progressPercent !== 100 && (
        <Progress className="h-2" value={percent.progressPercent} />
      )}
    </div>
  );
}
