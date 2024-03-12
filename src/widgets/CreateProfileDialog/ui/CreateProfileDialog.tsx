import { CreateProfileForm } from "@/features/create-profile-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProfileDialog(props: CreateProfileDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Создание профиля</DialogTitle>
          <CreateProfileForm onModalToggle={() => props.onOpenChange(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
