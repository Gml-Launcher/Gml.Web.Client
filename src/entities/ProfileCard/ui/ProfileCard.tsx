import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Edit2Icon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import classes from './styles.module.css';

import { ClientState } from '@/widgets/client-hub';
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

interface ProfileCardParams {
  profile: ProfileExtendedBaseEntity;
}

export const ProfileCard = ({ profile }: ProfileCardParams) => {
  const { resolvedTheme: theme } = useTheme();

  const { mutateAsync, isPending } = useEditProfile();

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

    if (body.icon && body.icon[0]) {
      formUpdate.append('icon', body.icon[0]);
    }

    if (body.background && body.background[0]) {
      formUpdate.append('background', body.background[0]);
    }

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
          theme === 'dark'
            ? `linear-gradient(rgba(10, 10, 10, .6), rgba(10, 10, 10, 1)), url(${profile.background})`
            : `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, 1)), url(${profile.background})`,
      }}
    >
      {/* Кнопка редактирования */}
      <div className={classes['profile-card__edit-button']}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className={classes['profile-card__edit-button-full']}>
              <Edit2Icon size={14} />
              Оформление
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Изображения</DialogTitle>
              <DialogDescription>Загрузите иконку и изображение профиля</DialogDescription>
            </DialogHeader>
            <Separator className="my-20px" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-3">
                  <h6 className="text-sm font-bold">Иконка</h6>
                  {form.watch('icon') && form.watch('icon')[0] ? (
                    <div className="mt-2">
                      <Image
                        alt="Preview Icon"
                        src={URL.createObjectURL(form.watch('icon')[0])}
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <InputFile fileTypes={['PNG']} {...form.register('icon')} />
                  )}
                  {form.formState.errors.icon && (
                    <FormMessage>{form.formState.errors.icon.message?.toString()}</FormMessage>
                  )}

                  <h6 className="text-sm font-bold">Задний фон</h6>
                  {form.watch('background') && form.watch('background')[0] ? (
                    <div className="mt-2">
                      <Image
                        alt="Background Preview"
                        src={URL.createObjectURL(form.watch('background')[0])}
                        layout="responsive"
                        width={300}
                        height={150}
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <InputFile fileTypes={['PNG']} {...form.register('background')} />
                  )}
                  {form.formState.errors.background && (
                    <FormMessage>
                      {form.formState.errors.background.message?.toString()}
                    </FormMessage>
                  )}

                  <Button
                    disabled={isPending || form.formState.disabled || !form.formState.isDirty}
                    className="w-fit ml-auto"
                  >
                    {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Профиль */}
      <div className={classes['profile-card__info']}>
        <div className={classes['profile-card__info-state']}>
          <ClientState state={state || profile.state} />
        </div>
        <div className={classes['profile-card__info-icon-wrapper']}>
          {profile.iconBase64 ? (
            <Image
              className="min-w-12 min-h-12 h-12 w-12"
              src={`data:image/png;base64,${profile.iconBase64}`}
              alt={profile.profileName || 'Profile Icon'}
              width={48}
              height={48}
            />
          ) : (
            <div className="min-w-12 min-h-12 h-12 w-12 bg-gray-200/10 rounded-xl animate-pulse" />
          )}

          {/* Текст профиля */}
          <div className={classes['profile-card__info-text']}>
            <h3 className={classes['profile-card__info-name']}>{profile.profileName}</h3>
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
