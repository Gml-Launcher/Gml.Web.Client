import Link from "next/link";

import { SignInForm } from "@/features/auth-credentials-form";

import { AUTH_PAGES } from "@/shared/routes";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

export default function SignInPage() {
  return (
    <>
      <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
        <Link
          href={AUTH_PAGES.SIGN_UP}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Регистрация
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Войдите в учетную запись</h1>
            <p className="text-sm text-muted-foreground">
              Введите свой логин и пароль ниже, чтобы войти в свою учетную запись
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </>
  );
}
