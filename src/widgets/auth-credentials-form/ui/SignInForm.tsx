"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SignInFormSchemaType, signInSchema } from "@/widgets/auth-credentials-form/lib/static";
import { authService } from "@/shared/services";
import { useMutation } from "@tanstack/react-query";
import { DASHBOARD_PAGES } from "@/shared/routes";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SignInForm = ({ className, ...props }: SignInFormProps) => {
  const route = useRouter();
  const toast = useToast();

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: (data: SignInFormSchemaType) => authService.signIn(data),
    onSuccess: () => {
      toast.toast({
        title: "Успешная авторизация",
        description: "Добро пожаловать в платформу",
      });
      form.reset();
      route.push(DASHBOARD_PAGES.HOME);
    },
    onError: () => {
      toast.toast({
        title: "Упс!",
        description: "Проверьте правильность введенных данных",
      });
    },
  });

  const onSubmit: SubmitHandler<SignInFormSchemaType> = async (data: SignInFormSchemaType) => {
    mutate(data);
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
            <FormLabel>Введите пароль</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Введите пароль" {...form.register("password")} />
            </FormControl>
            {form.formState.errors.password && (
              <FormMessage>{form.formState.errors.password.message}</FormMessage>
            )}
          </FormItem>

          <Button className={"w-full"} disabled={isPending}>
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>
      </Form>
    </div>
  );
};
