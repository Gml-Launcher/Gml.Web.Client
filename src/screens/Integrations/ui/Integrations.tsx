"use client";

import { useState } from "react";
import { IntegrationCard } from "@/widgets/IntegrationCard";
import { GenerateLauncherDialog } from "@/widgets/GenerateLauncherDialog";
import { AuthenticationMethodDialog } from "@/widgets/AuthenticationMethodDialog";

export const IntegrationsPage = () => {
  const [isGenerateLauncherDialogOpen, setIsGenerateLauncherDialogOpen] = useState(false);
  const onGenerateLauncherDialogToggle = () => setIsGenerateLauncherDialogOpen((prev) => !prev);

  const [isAuthenticationDialogOpen, setIsAuthenticationDialogOpen] = useState(false);
  const onAuthenticationDialogToggle = () => setIsAuthenticationDialogOpen((prev) => !prev);

  return (
    <>
      <div className="flex flex-col items-start py-4">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold mb-8">Интеграции</h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <IntegrationCard
            title="Аутентификация"
            description="Синхронизация и управление данными о пользователях на платформе"
            action={onAuthenticationDialogToggle}
          />
          <IntegrationCard
            title="Сборка лаунчера"
            description="Создайте лаунчер для платформ Windows, MacOS и Linux в пару кликов"
            action={onGenerateLauncherDialogToggle}
          />
          <IntegrationCard
            isDisabled
            title="Discord"
            description="Синхронизация лаунчера и вашего Discord сервера"
          />
          <IntegrationCard
            isDisabled
            buttonText="Предложить"
            title="Нужен сервис?"
            description="Отправь заявку, а мы придумаем что-нибудь"
          />
        </div>
      </div>

      <AuthenticationMethodDialog
        open={isAuthenticationDialogOpen}
        onOpenChange={onAuthenticationDialogToggle}
      />

      <GenerateLauncherDialog
        open={isGenerateLauncherDialogOpen}
        onOpenChange={onGenerateLauncherDialogToggle}
      />
    </>
  );
};
