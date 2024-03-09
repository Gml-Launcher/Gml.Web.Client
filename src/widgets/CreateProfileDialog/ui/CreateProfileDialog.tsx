import * as React from "react";

import { CreateProfileForm } from "@/features/create-profile-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreateProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProfileDialog(props: CreateProfileDialogProps) {
  const { open, onOpenChange } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Создание профиля</DialogTitle>
          <CreateProfileForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
