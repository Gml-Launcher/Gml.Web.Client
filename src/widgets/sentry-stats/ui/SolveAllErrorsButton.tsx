import { Button } from '@/shared/ui/button';
import { useSolveSentryErrors } from '@/shared/hooks';
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

export const SolveAllErrorsButton = () => {
  const { mutateAsync, isPending } = useSolveSentryErrors();
  const SolveAllErrors = async () => {
    await mutateAsync();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-start gap-x-2">
          <Button variant="outline">Пометить все ошибки решенными</Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Все ошибки будут помечены решенными и будут безвозвратно удалены из истории и графиков.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={SolveAllErrors}>Продолжить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
