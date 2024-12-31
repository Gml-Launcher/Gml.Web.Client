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
import { Button } from '@/shared/ui/button';
import { useClearNotifications } from '@/shared/hooks';

interface ClearNotificationModelParams {
  description: string;
  className?: string;
}

export const ClearNotificationModel = ({
  description,
  className,
}: ClearNotificationModelParams) => {
  const { mutateAsync, isPending } = useClearNotifications();

  const onSubmit = () => {
    mutateAsync();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className={className}>
          {description}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Предупреждение</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь очистить все уведомления. Это действие необратимо и все ваши уведомления
            будут удалены. Вы уверены, что хотите продолжить?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {isPending ? <></> : <>Отменить</>}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isPending}>
            Продолжить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
