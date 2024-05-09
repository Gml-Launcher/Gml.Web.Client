import { ConnectTexturesForm } from "@/features/connect-textures-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

interface GenerateLauncherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectTexturesDialog(props: GenerateLauncherDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Подключение сервиса скинов и плащей</DialogTitle>
        </DialogHeader>
        <ConnectTexturesForm onOpenChange={props.onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
