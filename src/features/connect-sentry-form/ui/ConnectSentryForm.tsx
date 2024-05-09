"use client";

import React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEditSentry, useSentry } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { integrationSchema, SentryFormSchemaType } from "../lib/static";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function ConnectSentryForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const { data } = useSentry();
  const { mutateAsync, isPending } = useEditSentry();

  const form = useForm<SentryFormSchemaType>({
    values: {
      url: data?.url || "",
    },
    resolver: zodResolver(integrationSchema),
  });

  const onSubmit: SubmitHandler<SentryFormSchemaType> = async (data: SentryFormSchemaType) => {
    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Введите эндпоинт</FormLabel>
            <FormControl>
              <Input placeholder="Введите эндпоинт" {...form.register("url")} />
            </FormControl>
            {form.formState.errors.url && (
              <FormMessage>{form.formState.errors.url.message}</FormMessage>
            )}
          </FormItem>

          <Button
            type="submit"
            className="w-fit ml-auto"
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
