import React from "react";

import { IntegrationForm } from "@/features/integration-form";

import { useCurrentIntegration } from "@/shared/hooks";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditIntegrationDialog(props: DialogProps) {
  const currentIntegration = useCurrentIntegration();

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Редактирование ${currentIntegration?.name}`}</DialogTitle>
        </DialogHeader>
        <IntegrationForm onOpenChange={props.onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
