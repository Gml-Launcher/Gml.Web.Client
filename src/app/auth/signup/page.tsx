import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { SignUpForm } from "@/features/auth-credentials-form";
import { cn } from "@/shared/lib/utils";
import { AUTH_PAGES } from "@/shared/routes";

export default function SignUPPage() {
  return (
    <>
      <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
        <Link
          href={AUTH_PAGES.SIGN_IN}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Войти
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Создайте учетную запись</h1>
            <p className="text-sm text-muted-foreground">
              Введите свой адрес электронной почты ниже, чтобы создать свою учетную запись
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </>
  );
}
