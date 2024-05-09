"use client";

import { useState } from "react";

import { CreateProfileDialog } from "@/widgets/create-profile-dialog";
import { ProfilesTable } from "@/widgets/profiles-table";

import { Button } from "@/shared/ui/button";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { DASHBOARD_PAGES } from "@/shared/routes";

export default function ProfilesPage() {
  const [isCreateProfileDialog, setIsCreateProfileDialog] = useState(false);
  const onCreateProfileDialogToggle = () => setIsCreateProfileDialog((prev) => !prev);

  return (
    <>
      <Breadcrumbs
        current={"Профили"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="flex flex-col items-start py-4">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold mb-8">Профили</h1>
          <Button className="w-fit" onClick={onCreateProfileDialogToggle}>
            Создать профиль
          </Button>
        </div>
        <div className="flex flex-col gap-y-6 w-full">
          <ProfilesTable />
        </div>
      </div>

      <CreateProfileDialog
        open={isCreateProfileDialog}
        onOpenChange={onCreateProfileDialogToggle}
      />
    </>
  );
}
