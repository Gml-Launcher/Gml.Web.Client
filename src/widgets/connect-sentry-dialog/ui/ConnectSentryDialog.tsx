import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { ConnectSentryForm } from "@/features/connect-sentry-form/ui/ConnectSentryForm";

interface AuthenticationMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectSentryDialog(props: AuthenticationMethodDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Подключение Sentry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <ConnectSentryForm onOpenChange={() => props.onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
