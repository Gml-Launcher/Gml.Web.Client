"use client";

import { useState } from "react";

import { GenerateLauncherDialog } from "@/widgets/generate-launcher-dialog";
import { ChooseAuthenticationMethodDialog } from "@/widgets/choose-authentication-method-dialog";
import { ConnectSentryDialog } from "@/widgets/connect-sentry-dialog";
import { ConnectTexturesDialog } from "@/widgets/connect-textures-dialog";

import { IntegrationCard } from "@/entities/IntegrationCard";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { useSentry } from "@/shared/hooks";
import { DASHBOARD_PAGES } from "@/shared/routes";

export default function IntegrationsPage() {
  const [isGenerateLauncherDialogOpen, setIsGenerateLauncherDialogOpen] = useState(false);
  const onGenerateLauncherDialogToggle = () => setIsGenerateLauncherDialogOpen((prev) => !prev);

  const [isAuthenticationDialogOpen, setIsAuthenticationDialogOpen] = useState(false);
  const onAuthenticationDialogToggle = () => setIsAuthenticationDialogOpen((prev) => !prev);

  const [isSentryConnectDialogOpen, setIsSentryConnectDialogOpen] = useState(false);
  const onSentryConnectDialogToggle = () => setIsSentryConnectDialogOpen((prev) => !prev);

  const [isConnectTexturesDialogOpen, setIsConnectTexturesDialogOpen] = useState(false);
  const onConnectTexturesDialogToggle = () => setIsConnectTexturesDialogOpen((prev) => !prev);

  const { data: sentry, isLoading: isLoadingSentry } = useSentry();

  return (
    <>
      <Breadcrumbs
        current={"Интеграции"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="flex flex-col items-start py-4">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold mb-8">Интеграции</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <IntegrationCard
            title="Аутентификация"
            description="Синхронизация и управление данными о пользователях на платформе"
            action={onAuthenticationDialogToggle}
            status={"CONNECTED"}
            buttonText={"Изменить"}
          />
          <IntegrationCard
            title="Сборка лаунчера"
            description="Создайте лаунчер для платформ Windows, MacOS и Linux в пару кликов"
            action={onGenerateLauncherDialogToggle}
            status={"CONNECTED"}
            buttonText={"Собрать"}
          />
          <IntegrationCard
            title="Сервис скинов"
            description="Добавь интеграцию со сервисом скинов, для отображения скинов и плащей в игре"
            action={onConnectTexturesDialogToggle}
            status={"CONNECTED"}
            buttonText={"Настроить"}
          />
          <IntegrationCard
            title="Sentry"
            description={"Подключение платформы для отслеживания ошибок и мониторинга приложений"}
            action={onSentryConnectDialogToggle}
            isDisabled={isLoadingSentry}
            status={sentry?.url ? "CONNECTED" : "UNCONNECTED"}
            buttonText={sentry?.url ? "Изменить" : "Подключить"}
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

      <ChooseAuthenticationMethodDialog
        open={isAuthenticationDialogOpen}
        onOpenChange={onAuthenticationDialogToggle}
      />

      <GenerateLauncherDialog
        open={isGenerateLauncherDialogOpen}
        onOpenChange={onGenerateLauncherDialogToggle}
      />

      <ConnectSentryDialog
        open={isSentryConnectDialogOpen}
        onOpenChange={onSentryConnectDialogToggle}
      />

      <ConnectTexturesDialog
        open={isConnectTexturesDialogOpen}
        onOpenChange={onConnectTexturesDialogToggle}
      />
    </>
  );
}
