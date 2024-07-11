import { Ubuntu_Mono } from "next/font/google";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useConnectionHub } from "@/widgets/generate-launcher-dialog";

import { useLauncherGithubBranches } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { ClientBuildFormSchemaType, ClientBuildSchema } from "../lib/static";
import { useOnSubmit } from "../lib/hooks/useOnSubmit";

interface BuildClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  connectionHub: ReturnType<typeof useConnectionHub>["connectionHub"];
  state: ReturnType<typeof useConnectionHub>["build"];
}

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

export function BuildClientForm({
  className,
  connectionHub,
  state,
  ...props
}: BuildClientFormProps) {
  const { isBuilding, logs } = state;

  const { data: branches } = useLauncherGithubBranches();

  const { onSubmit } = useOnSubmit({
    connectionHub,
    state,
  });

  const form = useForm<ClientBuildFormSchemaType>({
    values: { branch: "" },
    resolver: zodResolver(ClientBuildSchema),
    disabled: isBuilding,
  });

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите версию</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите версию" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches &&
                        branches.map(({ version }) => (
                          <SelectItem key={version} value={version}>
                            {version}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.branch && (
                  <FormMessage>{form.formState.errors.branch.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex gap-x-4 justify-end items-center">
            <Button className="w-fit" disabled={isBuilding || !form.formState.isDirty}>
              {isBuilding && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Собрать
            </Button>
          </div>
        </form>
      </Form>
      {isBuilding && logs && (
        <Textarea
          value={logs.join("\n")}
          className={cn("h-64 max-h-64 font-sans", ubuntuMono.variable)}
          readOnly
        />
      )}
    </div>
  );
}
