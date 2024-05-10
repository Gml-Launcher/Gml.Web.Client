"use client";

import { useEffect, useState } from "react";

import { Settings2 } from "lucide-react";

import { AuthenticationFormUndefined } from "@/features/authentication-undefined-form";
import { AuthenticationFormDle } from "@/features/authentication-dle-form";
import { AuthenticationAnyForm } from "@/features/authentication-any-form";
import { AuthenticationFormAzuriom } from "@/features/authentication-azuriom-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { AuthenticationType, AuthenticationTypeOption } from "@/shared/enums";
import { useActiveAuthIntegrations, useAuthIntegrations } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";

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

  const isFormUndefined =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_UNDEFINED;
  const isFormDatalife =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE;
  const isFormAny = Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_ANY;
  const isFormAzuriom =
    Number(authenticationTab) === AuthenticationType.AUTHENTICATION_TYPE_AZURIOM;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-fit"
          disabled={isLoadingIntegration || isLoadingActiveIntegration}
        >
          <Settings2 className="mr-2" size={16} />
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
              <p className="text-sm text-gray-700">
                Текущий метод аутентификации игроков в лаунчере
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <Select defaultValue={authenticationTab} onValueChange={onAuthenticationTabToggle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified email to display" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
