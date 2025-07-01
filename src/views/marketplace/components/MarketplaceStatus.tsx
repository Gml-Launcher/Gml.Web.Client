"use client";

import { ServerOffIcon, AlertTriangleIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { AuthenticationRecloudID } from '@/features/authentication-recloud-id';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Проверка доступности маркетплейса...' }: LoadingStateProps) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

interface UnauthorizedStateProps {
  onAuthenticated: () => void;
}

export const UnauthorizedState = ({ onAuthenticated }: UnauthorizedStateProps) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Требуется авторизация</AlertTitle>
          <AlertDescription>
            Для доступа к маркетплейсу необходимо авторизоваться через RecloudID.
          </AlertDescription>
        </Alert>
        <AuthenticationRecloudID onAuthenticated={onAuthenticated} />
      </div>
    </div>
  );
};

interface UnavailableStateProps {
  errorMessage: string | null;
  onRetry: () => void;
}

export const UnavailableState = ({ errorMessage, onRetry }: UnavailableStateProps) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <ServerOffIcon className="h-4 w-4" />
          <AlertTitle>Сервер маркетплейса недоступен</AlertTitle>
          <AlertDescription>
            {errorMessage || 'Не удалось подключиться к серверу маркетплейса. Пожалуйста, попробуйте позже.'}
          </AlertDescription>
        </Alert>
        <Button onClick={onRetry} className="mt-4 w-full">
          Повторить попытку
        </Button>
      </div>
    </div>
  );
};

interface AuthenticationStateProps {
  onAuthenticated: () => void;
}

export const AuthenticationState = ({ onAuthenticated }: AuthenticationStateProps) => {
  return (
    <div className="flex justify-center items-center py-10">
      <AuthenticationRecloudID onAuthenticated={onAuthenticated} />
    </div>
  );
};