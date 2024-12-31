'use client';

import React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { useEditIntegration } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icons } from '@/shared/ui/icons';
import { AuthenticationType } from '@/shared/enums';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationAnyForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const { mutateAsync, isPending } = useEditIntegration();

  const onSubmit = async () => {
    await mutateAsync({
      authType: AuthenticationType.AUTHENTICATION_TYPE_ANY,
      endpoint: 'https://localhost',
    }).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Внимание!</AlertTitle>
        <AlertDescription>
          Данный метод <strong>разрешит</strong> любую аутентификацию со стороны лаунчера
        </AlertDescription>
      </Alert>
      <Button type="submit" className="w-fit ml-auto" disabled={isPending} onClick={onSubmit}>
        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Сохранить
      </Button>
    </div>
  );
}
