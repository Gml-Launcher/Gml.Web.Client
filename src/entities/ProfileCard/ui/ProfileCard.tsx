import React from "react";

import Image from "next/image";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";
import { Edit2Icon } from "lucide-react";

import { ClientState } from "@/widgets/client-hub/ui/ClientState";

import { InputFile } from "@/shared/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormMessage } from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProfile } from "@/shared/hooks";

import {
  EditImageProfileSchema,
  EditImageProfileSchemaType,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";

import defaultProfileIcon from "@/assets/logos/minecraft.png";

import { Separator } from "@/shared/ui/separator";
import { Icons } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import classes from "./styles.module.css";

interface ProfileCardParams {
  profile: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

export const ProfileCard = ({ profile, isLoading }: ProfileCardParams) => {
  const { theme } = useTheme();

  const { mutateAsync, isPending } = useEditProfile();

  const { push } = useRouter();

  const form = useForm<EditImageProfileSchemaType>({
    disabled: isLoading,
    resolver: zodResolver(EditImageProfileSchema),
  });

  const OnSubmit: SubmitHandler<EditImageProfileSchemaType> = async (
    body: EditImageProfileSchemaType,
  ) => {
    const formUpdate = new FormData();

    formUpdate.append("name", profile?.profileName);
    formUpdate.append("originalName", profile?.profileName || "");
    formUpdate.append("description", profile?.description);
    formUpdate.append("icon", body.icon?.[0]);

    if (body.background && body.background[0]) {
      formUpdate.append("background", body.background[0]);
    }

    await mutateAsync(formUpdate);

    return push(`${DASHBOARD_PAGES.PROFILE}/${profile.profileName}`);
  };

  return (
    <div
      className={classes["profile-card"]}
      style={{
        backgroundImage:
          theme === "dark"
            ? `linear-gradient(rgba(10, 10, 10, .6), rgba(10, 10, 10, 1)), url(${profile.background})`
            : `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, 1)), url(${profile.background})`,
      }}
    >
      {/* Кнопка редактирования */}
      <div className={classes["profile-card__edit-button"]}>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={classes["profile-card__edit-button-full"]}
            >
              <Edit2Icon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Изображения</DialogTitle>
              <DialogDescription>Загрузите иконку и изображение профиля</DialogDescription>
            </DialogHeader>
            <Separator className="my-20px" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(OnSubmit)}>
                <div className="grid gap-3">
                  <h6 className="text-sm font-bold">Иконка</h6>
                  <InputFile fileTypes={["PNG"]} {...form.register("icon")} />
                  {form.formState.errors.icon && (
                    <FormMessage>{form.formState.errors.icon.message?.toString()}</FormMessage>
                  )}
                  <h6 className="text-sm font-bold">Задний фон</h6>
                  <InputFile fileTypes={["PNG"]} {...form.register("background")} />
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
      <div className={classes["profile-card__info"]}>
        <div className={classes["profile-card__info-state"]}>
          <ClientState state={profile.state} />
        </div>
        <div className={classes["profile-card__info-icon-wrapper"]}>
          <Image
            className={classes["profile-card__info-icon"]}
            src={
              profile.iconBase64
                ? `data:text/plain;base64,${profile.iconBase64}`
                : defaultProfileIcon
            }
            alt={profile.profileName}
            width={64}
            height={64}
          />

          {/* Текст профиля */}
          <div className={classes["profile-card__info-text"]}>
            <h3 className={classes["profile-card__info-name"]}>{profile.profileName}</h3>
            <p className={classes["profile-card__info-version"]}>
              <span className={classes["profile-card__info-version-minecraft"]}>
                {profile.minecraftVersion}
              </span>
              {profile.launchVersion && (
                <>
                  <span className={classes["profile-card__info-version-launch"]}>/</span>
                  <span className={classes["profile-card__info-version-launch-opacity"]}>
                    {profile.launchVersion}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
