import React from 'react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEditProfile } from '@/shared/hooks';
import {
  EditProfileFormSchemaType,
  EditProfileSchema,
  ProfileExtendedBaseEntity,
} from '@/shared/api/contracts';
import { Form, FormField, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Icons } from '@/shared/ui/icons';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Switch } from '@/shared/ui/switch';
import { Slider } from '@/shared/ui/slider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { JavaMajorVersion } from '@/shared/enums/java-major-version';
import { ProfileJavaVendor } from '@/shared/enums/profile-java-vendor';

interface EditProfileFormProps {
  profile?: ProfileExtendedBaseEntity;
}

export const EditProfileForm = (props: EditProfileFormProps) => {
  const { profile } = props;

  const { push } = useRouter();

  const { mutateAsync, isPending } = useEditProfile();
  const form = useForm<EditProfileFormSchemaType>({
    values: {
      name: profile?.profileName || '',
      displayName: profile?.displayName || '',
      description: profile?.description || '',
      jvmArguments: profile?.jvmArguments || '',
      gameArguments: profile?.gameArguments || '',
      icon: profile?.iconBase64 || '',
      priority: profile?.priority || 0,
      recommendedRam: profile?.recommendedRam || 1024,
      background: profile?.background || '',
      isEnabled: profile?.isEnabled,
      profileJavaVendor: profile?.profileJavaVendor,
      javaMajorVersion: profile?.javaMajorVersion,
    },
    resolver: zodResolver(EditProfileSchema),
  });

  const onSubmit: SubmitHandler<EditProfileFormSchemaType> = async (
    body: EditProfileFormSchemaType,
  ) => {
    const formUpdate = new FormData();
    formUpdate.append('name', body.name);
    formUpdate.append('displayName', body.displayName);
    formUpdate.append('originalName', profile?.profileName || '');
    formUpdate.append('description', body.description);

    const iconFile =
      body.icon && typeof body.icon !== 'string' && body.icon[0] instanceof File
        ? body.icon[0]
        : undefined;
    if (iconFile) {
      formUpdate.append('icon', iconFile);
    } else if (profile?.iconBase64) {
      try {
        const iconBlob = await fetch(`data:image/png;base64,${profile.iconBase64}`).then((r) =>
          r.blob(),
        );
        formUpdate.append('icon', new File([iconBlob], 'icon.png', { type: 'image/png' }));
      } catch (e) {
        console.error('Error converting existing icon to file:', e);
      }
    }

    formUpdate.append('enabled', body.isEnabled?.toString() ?? 'true');
    formUpdate.append('priority', body.priority?.toString() ?? '0');
    formUpdate.append('recommendedRam', body.recommendedRam?.toString() ?? '50');
    formUpdate.append('profileJavaVendor', body.profileJavaVendor?.toString() ?? '0');
    formUpdate.append('javaMajorVersion', body.javaMajorVersion?.toString() ?? '');

    const backgroundFile =
      body.background && typeof body.background !== 'string' && body.background[0] instanceof File
        ? body.background[0]
        : undefined;
    if (backgroundFile) {
      formUpdate.append('background', backgroundFile);
    } else if (profile?.background && profile.background.trim() !== '') {
      try {
        const backgroundResponse = await fetch(profile.background);
        const backgroundBlob = await backgroundResponse.blob();
        formUpdate.append(
          'background',
          new File([backgroundBlob], 'background.png', { type: 'image/png' }),
        );
      } catch (error) {
        console.error('Error fetching existing background image:', error);
      }
    }

    const needUpdateImages = Boolean(iconFile) || Boolean(backgroundFile);
    formUpdate.append('needUpdateImages', needUpdateImages.toString());

    if (body.jvmArguments) {
      formUpdate.append('jvmArguments', body.jvmArguments);
    }

    if (body.gameArguments) {
      formUpdate.append('gameArguments', body.gameArguments);
    }

    await mutateAsync(formUpdate);

    if (form.formState.dirtyFields.name) {
      return push(`${DASHBOARD_PAGES.PROFILE}/${body.name}`);
    }

    form.reset(body);
  };

  console.log({
    error: form.formState.errors,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-8 w-full lg:w-[58rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Состояние</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Отображение профиля в лаунчере
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Название</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается в директории</p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите название профиля"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Отображаемое имя</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Отображается в лаунчере, профиле
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите отображаемое имя"
                {...form.register('displayName')}
              />
              {form.formState.errors.displayName && (
                <FormMessage>{form.formState.errors.displayName.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Описание</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается в лаунчере</p>
            </div>
            <div className="flex flex-col items-end gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {form.watch('description')?.length} из 255
              </p>
              <Textarea
                placeholder="Введите описание сервера"
                rows={5}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <FormMessage>{form.formState.errors.description.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Jvm Аргументы</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Параметры запуска виртуальной Java машины
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите ваши jvm аргументы"
                {...form.register('jvmArguments')}
              />
              {form.formState.errors.jvmArguments && (
                <FormMessage>{form.formState.errors.jvmArguments.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Game Аргументы</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Параметры запуска клиента</p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите ваши game аргументы"
                {...form.register('gameArguments')}
              />
              {form.formState.errors.gameArguments && (
                <FormMessage>{form.formState.errors.gameArguments.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Приоритет</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Чем выше число, тем выше профиль в списке
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Input type="number" placeholder="Смените приоритет" {...form.register('priority')} />
              {form.formState.errors.priority && (
                <FormMessage>{form.formState.errors.priority.message?.toString()}</FormMessage>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Версия Java</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Версия запускаемой Java</p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <Controller
                control={form.control}
                name="javaMajorVersion"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={String(field.value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Версия" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Minecraft</SelectLabel>
                        <SelectItem
                          value="0"
                          onMouseDown={() => {
                            form.setValue('profileJavaVendor', ProfileJavaVendor.DEFAULT);
                          }}
                        >
                          По умолчанию
                        </SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Azul</SelectLabel>
                        {Object.values(JavaMajorVersion).map((version) => (
                          <SelectItem
                            key={version}
                            value={version}
                            onMouseDown={() => {
                              form.setValue('profileJavaVendor', ProfileJavaVendor.AZUL);
                            }}
                          >
                            Java {version}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.profileJavaVendor && (
                <FormMessage>
                  {form.formState.errors.profileJavaVendor.message?.toString()}
                </FormMessage>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Рекомендуемая оперативная память</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Текущее значение:{' '}
                {(form.watch('recommendedRam') ?? 0) >= 1024
                  ? `${((form.watch('recommendedRam') ?? 0) / 1024).toFixed(2)} ГБ`
                  : `${form.watch('recommendedRam') ?? 0} МБ`}
              </p>
            </div>
            <div className="flex flex-col gap-y-1 w-full md:min-w-96 mb-2 lg:mb-0">
              <FormField
                control={form.control}
                name="recommendedRam"
                render={({ field }) => (
                  <Slider
                    value={[field.value ?? 0]}
                    max={18000}
                    step={8}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending || form.formState.disabled || !form.formState.isDirty}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
