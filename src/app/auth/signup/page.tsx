import Link from "next/link";

import { SignInForm, SignUpForm } from "../../../features/auth-credentials-form";
import { cn } from "../../../shared/lib/utils";
import { AUTH_PAGES } from "../../../shared/routes";
import { buttonVariants } from "@/shared/ui/button";
import Image from "next/image";
import logo from "@/assets/logos/logo.svg";

export default function SignUPPage() {
  return (
    <>
      <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-3">
              <Image src={logo} className="w-12" alt="GML Frontend" />
              <h1 className="text-3xl font-bold">Регистрация</h1>
              <p className="text-balance text-muted-foreground">
                Введите свой адрес электронной почты ниже, чтобы создать свою учетную запись
              </p>
            </div>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link href={AUTH_PAGES.SIGN_IN} className="underline">
                Войти
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:flex items-center justify-center">
          <Image src={logo} className="w-42 opacity-10" alt="GML Frontend" />
        </div>
      </div>
    </>
  );
}
