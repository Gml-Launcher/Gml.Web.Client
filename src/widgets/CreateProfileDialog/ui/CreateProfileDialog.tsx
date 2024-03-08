import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as React from "react";
import { CreateProfileForm } from "@/feature/create-profile-form";

interface CreateProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateProfileDialog = (props: CreateProfileDialogProps) => {
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
};
