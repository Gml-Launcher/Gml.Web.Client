"use client";

import React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  IntegrationFormSchemaType,
  integrationSchema,
} from "@/features/integration-form/lib/static";
import { useCurrentIntegration, useEditIntegration } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function IntegrationForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const currentIntegration = useCurrentIntegration();

  const { mutateAsync, isPending } = useEditIntegration();

  const form = useForm<IntegrationFormSchemaType>({
    values: {
      endpoint: currentIntegration?.endpoint || "",
      authType: currentIntegration?.authType || 1,
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
            {form.formState.errors.endpoint && (
              <FormMessage>{form.formState.errors.endpoint.message}</FormMessage>
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
