import { Trash2Icon } from 'lucide-react';

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
} from '@/shared/ui/alert-dialog';
import { useDeleteGameServer } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';

type DeleteGameServerDialogParams = {
  serverName: string;
  profileName: string;
};

export const DeleteGameServerDialog = ({
  profileName,
  serverName,
}: DeleteGameServerDialogParams) => {
  const { mutateAsync, isPending } = useDeleteGameServer();

  const onSubmit = async () => {
    await mutateAsync({ profileName, serverName });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
          <Trash2Icon className="h-5 w-5" />
          <span className="sr-only">Удалить сервер</span>
        </Button>
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
          <AlertDialogAction disabled={isPending} onClick={onSubmit}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
