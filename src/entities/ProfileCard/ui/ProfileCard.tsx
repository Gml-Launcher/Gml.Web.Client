import React from "react";

import Image from "next/image";

import { useTheme } from "next-themes";
import { Edit2Icon } from "lucide-react";

import { ClientState } from "@/widgets/client-hub/ui/ClientState";

import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { Button } from "@/shared/ui/button";

import defaultProfileIcon from "@/assets/logos/minecraft.png";

import classes from "./styles.module.css";

interface ProfileCardParams {
  profile: ProfileExtendedBaseEntity;
}

export const ProfileCard = ({ profile }: ProfileCardParams) => {
  const { theme } = useTheme();

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
        <Button variant="outline" size="icon" className={classes["profile-card__edit-button-full"]}>
          <Edit2Icon size={16} />
        </Button>
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
              <span className={classes["profile-card__info-version-launch"]}>/</span>
              <span className={classes["profile-card__info-version-launch-opacity"]}>
                {profile.launchVersion}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
