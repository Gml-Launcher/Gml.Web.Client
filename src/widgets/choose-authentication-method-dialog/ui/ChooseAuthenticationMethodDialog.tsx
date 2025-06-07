'use client';

import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';

import { AuthenticationFormUndefined } from '@/features/authentication-undefined-form';
import { AuthenticationFormDle } from '@/features/authentication-dle-form';
import { AuthenticationAnyForm } from '@/features/authentication-any-form';
import { AuthenticationFormAzuriom } from '@/features/authentication-azuriom-form';
import { AuthenticationFormEasycabinet } from '@/features/authentication-easycabinet-form';
import { AuthenticationFormUniCoreCMS } from '@/features/authentication-unicorecms-form';
import { AuthenticationFormCustom } from '@/features/authentication-custom-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { AuthenticationType, AuthenticationTypeOption } from '@/shared/enums';
import { useActiveAuthIntegrations, useAuthIntegrations } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import { AuthenticationFormNamelessMC } from '@/features/authentication-nameless-mc-form/ui/AuthenticationFormNamelessMC';
import { AuthenticationFormWebMCRReloaded } from '@/features/authentication-webmcr-reloaded-form';
import { AuthenticationFormWordpress } from '@/features/authentication-wordpress-form';

export function ChooseAuthenticationMethodDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: integrations, isLoading: isLoadingIntegration } = useAuthIntegrations();
  const { data: activeIntegrations, isLoading: isLoadingActiveIntegration } =
    useActiveAuthIntegrations();

  const [authenticationTab, setAuthenticationTab] = useState(String(activeIntegrations?.authType));
  const onAuthenticationTabToggle = (tab: string) => setAuthenticationTab(() => tab);

  useEffect(() => {
    setAuthenticationTab(String(activeIntegrations?.authType));
  }, [activeIntegrations]);

  const isFormAny = Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_ANY;
  const isFormUndefined =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_UNDEFINED;
  const isFormDatalife =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE;
  const isNamelessMC =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_NAMELESS_MC;
  const isWebMCR =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_WEB_MCR_RELOADED;
  const isWordPress =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_WORDPRESS;
  const isFormAzuriom =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_AZURIOM;
  const isFormEasyCabinet =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_EASY_CABINET;
  const isFormUniCoreCMS =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_UNICORECMS;
  const isFormCustom = Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_CUSTOM;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-fit"
          disabled={isLoadingIntegration || isLoadingActiveIntegration}
        >
          <KeyRound className="mr-2" size={16} />
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Метод аутентификации</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <div className="flex gap-x-8 mb-8">
            <div className="flex flex-col gap-y-1 w-1/2">
              <h6 className="text-sm font-bold">Метод</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Текущий метод аутентификации игроков в лаунчере
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <Select defaultValue={authenticationTab} onValueChange={onAuthenticationTabToggle}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите метод аутентификации" />
                </SelectTrigger>
                <SelectContent>
                  {integrations &&
                    integrations.map(({ authType }) => (
                      <SelectItem key={authType} value={String(authType)}>
                        {AuthenticationTypeOption[`OPTION_${authType}`]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {isFormUndefined && <AuthenticationFormUndefined onOpenChange={onOpenChange} />}
          {isFormDatalife && <AuthenticationFormDle onOpenChange={onOpenChange} />}
          {isFormAny && <AuthenticationAnyForm onOpenChange={onOpenChange} />}
          {isFormAzuriom && <AuthenticationFormAzuriom onOpenChange={onOpenChange} />}
          {isFormEasyCabinet && <AuthenticationFormEasycabinet onOpenChange={onOpenChange} />}
          {isFormUniCoreCMS && <AuthenticationFormUniCoreCMS onOpenChange={onOpenChange} />}
          {isFormCustom && <AuthenticationFormCustom onOpenChange={onOpenChange} />}
          {isNamelessMC && <AuthenticationFormNamelessMC onOpenChange={onOpenChange} />}
          {isWebMCR && <AuthenticationFormWebMCRReloaded onOpenChange={onOpenChange} />}
          {isWordPress && <AuthenticationFormWordpress onOpenChange={onOpenChange} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
