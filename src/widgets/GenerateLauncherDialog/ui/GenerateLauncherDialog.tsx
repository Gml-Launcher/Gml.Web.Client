import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { InstallClientForm } from "@/features/install-client-form";

interface GenerateLauncherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateLauncherDialog(props: GenerateLauncherDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Сборка лаунчера</DialogTitle>
        </DialogHeader>
        <InstallClientForm />
      </DialogContent>
    </Dialog>
  );
}
