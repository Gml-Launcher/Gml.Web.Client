import { GenerateLauncherDialog } from "@/widgets/generate-launcher-dialog";
import { ChooseAuthenticationMethodDialog } from "@/widgets/choose-authentication-method-dialog";
import { ConnectTexturesDialog } from "@/widgets/connect-textures-dialog";
import { ConnectSentryDialog } from "@/widgets/connect-sentry-dialog";
import { ConnectDiscordDialog } from "@/widgets/connect-discord-dialog";

import { IntegrationCard } from "@/entities/IntegrationCard";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { DASHBOARD_PAGES } from "@/shared/routes";
import {
  DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD,
  DATA_TEST_ID_DIALOG_CONNECT_DISCORD,
  DATA_TEST_ID_DIALOG_CONNECT_SENTRY,
  DATA_TEST_ID_DIALOG_CONNECT_TEXTURES,
  DATA_TEST_ID_DIALOG_GENERATE_LAUNCHER,
} from "@/shared/constants/data";
import { LinkIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";

import Link from "next/link";

export const IntegrationsPage = () => {
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
            title="Аунтефикация"
            description="Синхронизация и управление данными о пользователях на платформе"
            dialog={<ChooseAuthenticationMethodDialog />}
            testid={DATA_TEST_ID_DIALOG_AUTHENTICATION_METHOD}
          />
          <IntegrationCard
            title="Сборка лаунчера"
            description="Создайте лаунчер для платформ Windows, MacOS и Linux в пару кликов"
            dialog={<GenerateLauncherDialog />}
            testid={DATA_TEST_ID_DIALOG_GENERATE_LAUNCHER}
          />
          <IntegrationCard
            title="Сервис скинов"
            description="Добавь интеграцию со сервисом скинов, для отображения скинов и плащей в игре"
            dialog={<ConnectTexturesDialog />}
            testid={DATA_TEST_ID_DIALOG_CONNECT_TEXTURES}
          />
          <IntegrationCard
            title="Sentry"
            description={"Подключение платформы для отслеживания ошибок и мониторинга приложений"}
            dialog={<ConnectSentryDialog />}
            testid={DATA_TEST_ID_DIALOG_CONNECT_SENTRY}
          />
          <IntegrationCard
            title="Discord"
            description="Синхронизация лаунчера и вашего Discord сервера"
            dialog={<ConnectDiscordDialog />}
            testid={DATA_TEST_ID_DIALOG_CONNECT_DISCORD}
          />
          <IntegrationCard
            title="Нужен сервис?"
            description="Отправь заявку, а мы придумаем что-нибудь"
            dialog={
              <Link target="_blank" href={"https://discord.com/invite/b5xgqfWgNt"}>
                <Button size="sm" variant="outline" className="w-fit">
                  <LinkIcon className="mr-2" size={16} />
                  Поддежка
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    </>
  );
};
