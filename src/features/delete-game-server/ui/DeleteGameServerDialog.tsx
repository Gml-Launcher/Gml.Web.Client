import { GameServerBaseEntity, ProfileExtendedBaseEntity } from "@/shared/api/contracts";
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
import { Trash2Icon } from "lucide-react";
import { useDeleteGameServer } from "@/shared/hooks/useServers";

type DeleteGameServerDialogParams = {
  server: GameServerBaseEntity;
  profile?: ProfileExtendedBaseEntity;
};

export const DeleteGameServerDialog = ({ server, profile }: DeleteGameServerDialogParams) => {
  const { mutateAsync, isPending } = useDeleteGameServer({ profileName: profile?.profileName });

  const onSubmit = async () => {
    await mutateAsync({ profileName: profile?.profileName, serverName: server.name });
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
            {`Вы уверены что хотите безвозвратно удалить сервер "${server.name}" в профиле "${profile?.profileName}"?`}
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
