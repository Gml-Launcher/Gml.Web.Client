import { Card, CardContent } from "@/shared/ui/card";
import React from "react";
import Image from "next/image";
import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { Button } from "@/shared/ui/button";
import { Edit2Icon } from "lucide-react";
import defaultProfileIcon from "@/assets/logos/minecraft.png";
import { ClientState } from "@/widgets/client-hub/ui/ClientState";

interface ProfileCardParams {
  profile: ProfileExtendedBaseEntity;
}

export const ProfileCard = ({ profile }: ProfileCardParams) => {
  return (
    <div
      className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm justify-between p-6 min-h-[230px]"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 10, 10, .6), rgba(10, 10, 10, 1)), url(${profile.background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Кнопка редактирования */}
      <div className="flex justify-end w-full">
        <Button variant="outline" size="icon" className="rounded-full">
          <Edit2Icon size={16} />
        </Button>
      </div>

      {/* Профиль */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ClientState state={profile.state} />
        </div>
        <div className="flex flex-wrap gap-x-5 items-center">
          <Image
            className="h-16 w-16 min-w-16 min-h-16 object-cover rounded"
            src={`data:text/plain;base64,${profile.iconBase64}`}
            alt={profile.profileName}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultProfileIcon.src;
            }}
            width={32}
            height={32}
          />
          {/* Текст профиля */}
          <div className="flex flex-col gap-y-1 ">
            <h3 className="truncate font-extrabold text-[28px]">{profile.profileName}</h3>
            <p className="flex gap-2">
              <span className="truncate font-bold">{profile.minecraftVersion}</span>
              <span className="truncate font-medium">/</span>
              <span className="truncate opacity-55">{profile.launchVersion}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
