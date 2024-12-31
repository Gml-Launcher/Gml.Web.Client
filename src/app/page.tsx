import Link from 'next/link';
import { CodeIcon, DesktopIcon, LockClosedIcon } from '@radix-ui/react-icons';
import {
  AtomIcon,
  CloudUploadIcon,
  GamepadIcon,
  GlobeLockIcon,
  MessageSquareHeartIcon,
  PencilIcon,
  ServerIcon,
  SettingsIcon,
  ShieldIcon,
} from 'lucide-react';
import React from 'react';

import { cn } from '@/shared/lib/utils';
import { AUTH_PAGES } from '@/shared/routes';
import { buttonVariants } from '@/shared/ui/button';
import WelcomeNavbar from '@/app/auth/welcome/welcomeNavbar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

const cardData = [
  {
    icon: <DesktopIcon className="text-blue-500 size-6 mb-2" />,
    title: 'Кроссплатформенность',
    description:
      'Поддержка различных операционных систем для легкости развертывания и использования.',
  },
  {
    icon: <GamepadIcon className="text-green-500 size-6 mb-2" />,
    title: 'Инфраструктура для Minecraft',
    description:
      'Полный набор инструментов для создания и управления игровыми клиентами и профилями.',
  },
  {
    icon: <ShieldIcon className="text-gray-700 size-6 mb-2" />,
    title: 'Безопасность и защита',
    description:
      'Встроенные механизмы безопасности и базовая защита для обеспечения безопасности проекта.',
  },
  {
    icon: <SettingsIcon className="text-teal-500 size-6 mb-2" />,
    title: 'Гибкость и расширяемость',
    description:
      'Легкая адаптация под различные требования и возможность расширять функциональность.',
  },
  {
    icon: <AtomIcon className="text-yellow-500 size-6 mb-2" />,
    title: 'Установка на любую ОС',
    description:
      'Простота и гибкость установки на Windows, Linux или macOS (сборка из исходного кода) с использованием Docker и Pterodactyl для удобства.',
  },
  {
    icon: <LockClosedIcon className="text-red-500 size-6 mb-2" />,
    title: 'Собственная авторизация',
    description:
      'Возможность использования собственной, так и предустановленной системы авторизации.',
  },
  {
    icon: <CodeIcon className="text-purple-500 size-6 mb-2" />,
    title: 'Современные технологии',
    description:
      'Использование C#, .NET 8, Docker и других технологий для обеспечения высокой производительности.',
  },
  {
    icon: <ServerIcon className="text-indigo-500 size-6 mb-2" />,
    title: 'Поддержка серверов',
    description: 'Удобная настройка и управление игровыми серверами с полной поддержкой Docker.',
  },
  {
    icon: <PencilIcon className="text-orange-500 size-6 mb-2" />,
    title: 'Редактирование лаунчера',
    description:
      'Легкость в редактировании стилей, цветов и компонентов лаунчера для индивидуальных нужд.',
  },
  {
    icon: <CloudUploadIcon className="text-teal-700 size-6 mb-2" />,
    title: 'Публикация лаунчера',
    description: 'Простота публикации лаунчера через панель для различных операционных систем.',
  },
  {
    icon: <GlobeLockIcon className="text-blue-600 size-6 mb-2" />,
    title: 'Интеграция с популярными сервисами',
    description:
      'Возможность подключения к сторонним API, таким как Discord, и другими платформами.',
  },
  {
    icon: <MessageSquareHeartIcon className="text-teal-700 size-6 mb-2" />,
    title: 'Обновления и поддержка',
    description:
      'Регулярные обновления с улучшениями и исправлениями, а также доступ к документации .',
  },
];

export default function Home() {
  return (
    <>
      <div className="p-4 sm:p-10 h-screen flex flex-col">
        <WelcomeNavbar />

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[550px_1fr] h-full gap-10 md:grid-cols-2 pt-32 sm:pt-16 items-start xl:items-center">
          <div className="flex relative gap-y-5 flex-col">
            <h1 className="text-4xl font-bold">Спасибо за выбор Gml</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Добро пожаловать в панель управления! Мы рады приветствовать вас в панели управления.
              Здесь вы можете настроить, управлять и следить за всеми аспектами вашего проекта.
            </p>

            <div className="flex gap-x-4">
              <Link
                href={AUTH_PAGES.SIGN_IN}
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                Войти
              </Link>
              <Link
                href={AUTH_PAGES.SIGN_UP}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Регистрация
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cardData.map((card) => (
              <div key={card.title} className="flex flex-col gap-5 w-full">
                <Card className="card-container">
                  <CardHeader>
                    {card.icon}
                    <CardTitle className="text-xl truncate">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
