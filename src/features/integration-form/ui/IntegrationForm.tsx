"use client";

import React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { useCurrentIntegration, useEditIntegration } from "@/shared/hooks";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  IntegrationFormSchemaType,
  integrationSchema,
} from "@/features/integration-form/lib/static";
import { cn } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function IntegrationForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const currentIntegration = useCurrentIntegration();

  const { mutateAsync, isPending } = useEditIntegration();

  const form = useForm<IntegrationFormSchemaType>({
    values: {
      endpoint: currentIntegration?.endpoint || "",
      authType: currentIntegration?.authType || 0,
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
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Тип авторизации</FormLabel>
            <FormControl>
              <Input
                placeholder="Тип авторизации"
                {...form.register("authType")}
                readOnly
                disabled
              />
            </FormControl>
            {form.formState.errors.authType && (
              <FormMessage>{form.formState.errors.authType.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Введите эндпоинт</FormLabel>
            <FormControl>
              <Input placeholder="Введите эндпоинт" {...form.register("endpoint")} />
            </FormControl>
            {form.formState.errors.endpoint && (
              <FormMessage>{form.formState.errors.endpoint.message}</FormMessage>
            )}
          </FormItem>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
