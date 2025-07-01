import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Edit2Icon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import React from 'react';

import classes from './styles.module.css';

import { InputFile } from '@/shared/ui/input';
import { Form, FormMessage } from '@/shared/ui/form';
import { useEditProfile } from '@/shared/hooks';
import {
  EditImageProfileSchema,
  EditImageProfileSchemaType,
  ProfileExtendedBaseEntity,
} from '@/shared/api/contracts';
import { Separator } from '@/shared/ui/separator';
import { Icons } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useProfileCardStore } from '@/entities/ProfileCard/lib/store';
import { TooltipContent } from '@/shared/ui/tooltip';
import { ClientState } from '@/widgets/client-hub';

interface ProfileCardParams {
  profile: ProfileExtendedBaseEntity;
}

export const ProfileCard = ({ profile }: ProfileCardParams) => {
  const { resolvedTheme: theme } = useTheme();

  const { mutateAsync, isPending } = useEditProfile();

  // State to track if existing images should be deleted
  const [deleteIcon, setDeleteIcon] = React.useState(false);
  const [deleteBackground, setDeleteBackground] = React.useState(false);

  const form = useForm<EditImageProfileSchemaType>({
    resolver: zodResolver(EditImageProfileSchema),
  });

  const onSubmit: SubmitHandler<EditImageProfileSchemaType> = async (
    body: EditImageProfileSchemaType,
  ) => {
    const formUpdate = new FormData();

    formUpdate.append('name', profile?.profileName);
    formUpdate.append('displayName', profile?.displayName);
    formUpdate.append('originalName', profile?.profileName);
    formUpdate.append('description', profile?.description);
    formUpdate.append('enabled', profile?.isEnabled.toString());
    formUpdate.append('jvmArguments', profile?.jvmArguments);
    formUpdate.append('gameArguments', profile?.gameArguments);
    formUpdate.append('priority', profile?.priority?.toString() ?? '0');

    // Обработка загрузки иконки
    if (body.icon && body.icon[0]) {
      // Если выбрана новая иконка, отправляем её
      formUpdate.append('icon', body.icon[0]);
    } else if (!deleteIcon && profile.iconBase64) {
      // Если иконка не удаляется и существует, отправляем существующую иконку
      // Конвертируем base64 в бинарный файл
      const iconBlob = await fetch(`data:image/png;base64,${profile.iconBase64}`).then((r) =>
        r.blob(),
      );
      formUpdate.append('icon', new File([iconBlob], 'icon.png', { type: 'image/png' }));
    }
    // Если deleteIcon = true, не включаем поле иконки, сервер обработает как null

    // Обработка загрузки фона
    if (body.background && body.background[0]) {
      // Если выбран новый фон, отправляем его
      formUpdate.append('background', body.background[0]);
    } else if (!deleteBackground && profile.background && profile.background.trim() !== '') {
      // Если фон не удаляется и существует, отправляем существующий фон
      // Загружаем изображение по URL и конвертируем в бинарный файл
      try {
        const backgroundResponse = await fetch(profile.background);
        const backgroundBlob = await backgroundResponse.blob();
        formUpdate.append(
          'background',
          new File([backgroundBlob], 'background.png', { type: 'image/png' }),
        );
      } catch (error) {
        console.error('Error fetching background image:', error);
      }
    }
    // Если deleteBackground = true, не включаем поле фона, сервер обработает как null

    await mutateAsync(formUpdate);

    // TODO: исправить костыль
    window.location.reload();
  };

  const { state } = useProfileCardStore();

  return (
    <div
      className={classes['profile-card']}
      style={{
        backgroundImage:
          profile.background && profile.background.trim() !== '' && !deleteBackground
            ? theme === 'dark'
              ? `linear-gradient(rgba(10, 10, 10, .6), rgba(10, 10, 10, 1)), url(${profile.background})`
              : `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, 1)), url(${profile.background})`
            : theme === 'dark'
              ? 'linear-gradient(rgba(10, 10, 10, .6), rgba(10, 10, 10, 1))'
              : 'linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, 1))',
      }}
    >
      {/* Кнопка редактирования */}
      <div className={classes['profile-card__edit-button']}>
        <div className={classes['profile-card__info-state']}>
          <ClientState state={state || profile.state} />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`${classes['profile-card__edit-button-full']} group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary`}
            >
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></span>
              <span className="relative z-10 flex items-center gap-2">
                <Edit2Icon
                  size={14}
                  className="group-hover:text-primary transition-colors duration-200"
                />
                <span>Оформление</span>
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20 border border-border/50">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gradient-to-b from-background/80 to-background/30">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold tracking-tight">
                  Изображения
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1.5">
                  Загрузите иконку и изображение профиля
                </DialogDescription>
              </DialogHeader>
            </div>
            <Separator className="opacity-50" />
            <div className="p-3 sm:p-4 md:p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Icon Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h6 className="text-sm font-medium text-foreground/80">Иконка</h6>
                        {profile.iconBase64 && !deleteIcon && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors duration-200"
                            type="button"
                            onClick={() => {
                              setDeleteIcon(true);
                              form.setValue('icon', null, { shouldDirty: true });
                            }}
                          >
                            Удалить иконку
                          </Button>
                        )}
                      </div>

                      {form.watch('icon') && form.watch('icon')[0] ? (
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm">
                          <div className="relative group">
                            <Image
                              alt="Preview Icon"
                              src={URL.createObjectURL(form.watch('icon')[0])}
                              width={64}
                              height={64}
                              className="rounded-md object-cover shadow-md transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-md"></div>
                          </div>
                          <div className="w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors duration-200"
                              type="button"
                              onClick={() => form.setValue('icon', null, { shouldDirty: true })}
                            >
                              Удалить иконку
                            </Button>
                          </div>
                        </div>
                      ) : profile.iconBase64 && !deleteIcon ? (
                        <div className="flex flex-col items-center sm:items-start gap-3 bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm">
                          <div className="relative group">
                            <Image
                              className="rounded-md object-cover shadow-md transition-transform duration-200 group-hover:scale-105"
                              src={`data:image/png;base64,${profile.iconBase64}`}
                              alt={profile.profileName || 'Profile Icon'}
                              width={64}
                              height={64}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-md"></div>
                          </div>
                          <div className="w-full">
                            <InputFile
                              fileTypes={['PNG', 'GIF', 'JPG']}
                              {...form.register('icon')}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm">
                          <InputFile fileTypes={['PNG', 'GIF', 'JPG']} {...form.register('icon')} />
                        </div>
                      )}
                      {form.formState.errors.icon && (
                        <FormMessage>{form.formState.errors.icon.message?.toString()}</FormMessage>
                      )}
                    </div>

                    {/* Background Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h6 className="text-sm font-medium text-foreground/80">Задний фон</h6>
                        {profile.background &&
                          profile.background.trim() !== '' &&
                          !deleteBackground && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors duration-200"
                              type="button"
                              onClick={() => {
                                setDeleteBackground(true);
                                form.setValue('background', null, { shouldDirty: true });
                              }}
                            >
                              Удалить фон
                            </Button>
                          )}
                      </div>

                      {form.watch('background') && form.watch('background')[0] ? (
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm space-y-3">
                          <div className="relative group w-full overflow-hidden rounded-md shadow-md h-[120px]">
                            <Image
                              alt="Background Preview"
                              src={URL.createObjectURL(form.watch('background')[0])}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                          </div>
                          <div className="flex justify-center sm:justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors duration-200"
                              type="button"
                              onClick={() =>
                                form.setValue('background', null, { shouldDirty: true })
                              }
                            >
                              Удалить фон
                            </Button>
                          </div>
                        </div>
                      ) : profile.background &&
                        profile.background.trim() !== '' &&
                        !deleteBackground ? (
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm space-y-3">
                          <div className="relative group w-full overflow-hidden rounded-md shadow-md h-[120px]">
                            {/* Use a div with background-image instead of next/image to avoid Invalid src prop error */}
                            <div
                              className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                              style={{
                                backgroundImage: `url(${profile.background})`,
                              }}
                              aria-label="Background Preview"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                          </div>
                          <InputFile fileTypes={['PNG', 'GIF']} {...form.register('background')} />
                        </div>
                      ) : (
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm">
                          <InputFile fileTypes={['PNG', 'GIF']} {...form.register('background')} />
                        </div>
                      )}
                      {form.formState.errors.background && (
                        <FormMessage>
                          {form.formState.errors.background.message?.toString()}
                        </FormMessage>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6 mt-4 sm:mt-6">
                    <Button
                      disabled={isPending || form.formState.disabled || !form.formState.isDirty}
                      className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 hover:shadow-md"
                    >
                      {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                      Сохранить
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Профиль */}
      <div className={classes['profile-card__info']}>
        <div className={classes['profile-card__info-icon-wrapper']}>
          {profile.iconBase64 && !deleteIcon ? (
            <Image
              className="min-w-12 min-h-12 h-12 w-12"
              src={`data:image/png;base64,${profile.iconBase64}`}
              alt={profile.profileName || 'Profile Icon'}
              width={48}
              height={48}
            />
          ) : (
            <div className="flex items-center justify-center min-w-12 min-h-12 h-12 w-12 bg-gray-200/5 rounded-xl">
              {profile.profileName.substring(0, 2).toUpperCase()}
            </div>
          )}

          {/* Текст профиля */}
          <div className={classes['profile-card__info-text']}>
            <h3 className={classes['profile-card__info-name']}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">{profile.profileName}</p>
                      <p className="truncate">{profile.displayName}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{profile.displayName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <p className={classes['profile-card__info-version']}>
              <span className={classes['profile-card__info-version-minecraft']}>
                {profile.minecraftVersion}
              </span>
              <span className={classes['profile-card__info-version-launch']}>
                / {profile.launchVersion ? profile.launchVersion : 'Профиль не загружен'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
