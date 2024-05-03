import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Tabs, TabsContent } from "@/shared/ui/tabs";
import { useAuthIntegrations } from "@/shared/hooks";
import { useMemo, useState } from "react";
import { IntegrationForm } from "@/features/integration-form";

interface AuthenticationMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationMethodDialog(props: AuthenticationMethodDialogProps) {
  const { data: integrations } = useAuthIntegrations();
  const [authenticationTab, setAuthenticationTab] = useState("DataLifeEngine");
  const onAuthenticationTabToggle = (tab: string) => setAuthenticationTab(() => tab);

  const TabsContentElement = useMemo(
    (): { [index: string]: React.ReactElement } => ({
      DataLifeEngine: <IntegrationForm onOpenChange={() => props.onOpenChange(false)} />,
      Undefined: <h3>Метод авторизации в разработке</h3>,
    }),
    [],
  );

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
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Выберите метод аутентификации игроков в лаунчере
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <Select defaultValue={authenticationTab} onValueChange={onAuthenticationTabToggle}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите  vtnjl" />
                </SelectTrigger>
                <SelectContent>
                  {integrations &&
                    integrations.data.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs value={authenticationTab} defaultValue={authenticationTab}>
            {integrations &&
              integrations.data.map(({ name }) => (
                <TabsContent key={name} value={name}>
                  {TabsContentElement[name]}
                </TabsContent>
              ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
