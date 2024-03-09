"use client";

import React, { useState } from "react";

import { CreateProfileDialog } from "@/widgets/CreateProfileDialog";
import { ProfilesTable } from "@/widgets/profiles-table";

import { Button } from "@/components/ui/button";

export default function ProfilesPage() {
  const [isCreateProfileDialog, setIsCreateProfileDialog] = useState(false);
  const onCreateProfileDialogToggle = () => setIsCreateProfileDialog((prev) => !prev);

  return (
    <>
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
