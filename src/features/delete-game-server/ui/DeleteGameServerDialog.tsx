import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { useDeleteGameServer } from "@/shared/hooks/useServers";

type DeleteGameServerDialogParams = {
  serverName: string;
  profileName: string;
};

export const DeleteGameServerDialog = ({
  profileName,
  serverName,
}: DeleteGameServerDialogParams) => {
  const { mutateAsync, isPending } = useDeleteGameServer({ profileName });

  const onSubmit = async () => {
    await mutateAsync({ profileName, serverName });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление сервера</AlertDialogTitle>
          <AlertDialogDescription>
            {`Вы уверены что хотите безвозвратно удалить сервер "${serverName}" в профиле "${profileName}"?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => onSubmit()}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
