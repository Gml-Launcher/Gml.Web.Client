import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { SentryConnectForm } from "@/features/sentry-connect-form/ui/SentryConnectForm";

interface AuthenticationMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SentryConnectDialog(props: AuthenticationMethodDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Подключение Sentry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <SentryConnectForm onOpenChange={() => props.onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
