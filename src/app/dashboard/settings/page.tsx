import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Настройки",
};

export default async function SettingsPage() {
  return (
    <div className="flex flex-col items-start py-4">
      <h1 className="text-xl font-bold mb-8">Управление аккаунтом</h1>
      <div className="flex flex-col gap-y-6">
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Данные учетной записи</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <Input
              id="email"
              placeholder="Ваш email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              // disabled={isLoading}
              // value={login}
              // onChange={onChangeLogin}
            />
            <Input
              id="phone"
              placeholder="Номер телефона"
              type="tel"
              autoCapitalize="none"
              autoComplete="phone"
              autoCorrect="off"
              // disabled={isLoading}
              // value={login}
              // onChange={onChangeLogin}
            />
            <Button className="ml-auto w-fit">Сохранить</Button>
          </CardContent>
        </Card>
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Управление паролем</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <Input
              id="old_password"
              placeholder="Введите старый пароль"
              type="password"
              autoCapitalize="none"
              autoComplete="old_password"
              autoCorrect="off"
              // disabled={isLoading}
              // value={login}
              // onChange={onChangeLogin}
            />
            <Input
              id="password"
              placeholder="Введите новый пароль"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              // disabled={isLoading}
              // value={login}
              // onChange={onChangeLogin}
            />
            <Input
              id="confirm_password"
              placeholder="Повторите новый пароль"
              type="password"
              autoCapitalize="none"
              autoComplete="confirm_password"
              autoCorrect="off"
              // disabled={isLoading}
              // value={login}
              // onChange={onChangeLogin}
            />
            <Button className="ml-auto w-fit">Сохранить</Button>
          </CardContent>
        </Card>
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Управление аккаунтом</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <CardDescription>
              Ваша учетная запись содержит персональные данные, которые вы нам предоставили. На этой
              странице вы можете загрузить или удалить эти данные. Удаление этих данных приведет к
              необратимому удалению вашей учетной записи, и это невозможно восстановить.
            </CardDescription>
            <div className="flex gap-x-4 ml-auto">
              <Button className="w-fit">Скачать</Button>
              <Button variant="outline" className="w-fit">
                Удалить аккаунт
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
