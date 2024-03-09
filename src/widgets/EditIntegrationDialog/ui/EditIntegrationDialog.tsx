import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IntegrationForm } from "@/feature/integration-form";
import React from "react";
import { useCurrentIntegration } from "@/shared/hooks";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditIntegrationDialog = (props: DialogProps) => {
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
};
