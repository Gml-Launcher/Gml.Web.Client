import { useEffect, useState } from "react";

import { AuthenticationFormDle } from "@/features/authentication-form-dle";
import { AuthenticationFormAzuriom } from "@/features/authentication-form-azuriom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { AuthenticationType, AuthenticationTypeOption } from "@/shared/enums";
import { useActiveAuthIntegrations, useAuthIntegrations } from "@/shared/hooks";
import { AuthenticationFormUndefined } from "@/features/authentication-form-undefined/ui/AuthenticationFormUndefined";
import { AuthenticationFormAny } from "@/features/authentication-form-any/ui/AuthenticationFormAny";

interface AuthenticationMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationMethodDialog(props: AuthenticationMethodDialogProps) {
  const { data: integrations } = useAuthIntegrations();
  const { data: activeIntegrations } = useActiveAuthIntegrations();

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
    <Dialog {...props}>
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
          {isFormUndefined && (
            <AuthenticationFormUndefined onOpenChange={() => props.onOpenChange(false)} />
          )}
          {isFormDatalife && (
            <AuthenticationFormDle onOpenChange={() => props.onOpenChange(false)} />
          )}
          {isFormAny && <AuthenticationFormAny onOpenChange={() => props.onOpenChange(false)} />}
          {isFormAzuriom && (
            <AuthenticationFormAzuriom onOpenChange={() => props.onOpenChange(false)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
