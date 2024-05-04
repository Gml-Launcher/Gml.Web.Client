"use client";

import React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEditIntegration, useGetActiveAuthIntegrations } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { IntegrationFormSchemaType, integrationSchema } from "../lib/static";
import { AuthenticationType } from "@/shared/enums";
import Link from "next/link";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationFormDle({ className, onOpenChange, ...props }: SignInFormProps) {
  const { data: integration } = useGetActiveAuthIntegrations();

  const { mutateAsync, isPending } = useEditIntegration();

  const form = useForm<IntegrationFormSchemaType>({
    values: {
      endpoint:
        integration.authType === AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE
          ? String(integration.endpoint)
          : "",
      authType:
        integration.authType === AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE
          ? integration.authType
          : AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE,
    },
    resolver: zodResolver(integrationSchema),
  });

  const onSubmit: SubmitHandler<IntegrationFormSchemaType> = async (
    data: IntegrationFormSchemaType,
  ) => {
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
              <Input placeholder="Введите эндпоинт" {...form.register("endpoint")} />
            </FormControl>

            {form.formState.errors.endpoint ? (
              <FormMessage>{form.formState.errors.endpoint.message}</FormMessage>
            ) : (
              <FormDescription>
                Не знаете где взять файл auth.php?{" "}
                <Link
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  href="https://stackoverflow.com/"
                  passHref={true}
                  target="_blank"
                >
                  Скачайте по ссылке
                </Link>
              </FormDescription>
            )}
          </FormItem>
          <Button type="submit" className="w-fit ml-auto" disabled={isPending}>
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
