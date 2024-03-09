"use client";

import React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { useRegistration } from "@/shared/hooks";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpFormSchemaType, signUpSchema } from "@/features/auth-credentials-form/lib/static";
import { cn } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { mutateAsync, isPending } = useRegistration();

  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormSchemaType> = async (data: SignUpFormSchemaType) => {
    mutateAsync(data);
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Введите логин</FormLabel>
            <FormControl>
              <Input placeholder="Введите логин" {...form.register("login")} />
            </FormControl>
            {form.formState.errors.login && (
              <FormMessage>{form.formState.errors.login.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Введите электронную почту</FormLabel>
            <FormControl>
              <Input placeholder="Введите электронную почту" {...form.register("email")} />
            </FormControl>
            {form.formState.errors.email && (
              <FormMessage>{form.formState.errors.email.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Введите пароль</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Введите пароль" {...form.register("password")} />
            </FormControl>
            {form.formState.errors.password && (
              <FormMessage>{form.formState.errors.password.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Повторите пароль</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Повторите пароль"
                {...form.register("confirmPassword")}
              />
            </FormControl>
            {form.formState.errors.confirmPassword && (
              <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>
            )}
          </FormItem>

          <Button className="w-full" disabled={isPending}>
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Создать аккаунт
          </Button>
        </form>
      </Form>
    </div>
  );
}
