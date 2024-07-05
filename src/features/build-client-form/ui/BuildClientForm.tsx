import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Ubuntu_Mono } from "next/font/google";

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

import { useGithubLauncherVersions } from "@/shared/hooks";
import { cn, getApiBaseUrl } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { ClientBuildFormSchemaType, ClientBuildSchema } from "../lib/static";
import { useConnectionHub } from "../lib/hooks/useConnectionHub";
import { Textarea } from "@/shared/ui/textarea";
import { useOnSubmitBuild } from "../lib/hooks/useOnSubmitBuild";

interface BuildClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: () => void;
  connectionState: ReturnType<typeof useConnectionHub>;
}

export function BuildClientForm({
  className,
  onOpenChange,
  connectionState,
  ...props
}: BuildClientFormProps) {
  const { connectionHub, process, percent, logs } = connectionState;
  const { onSubmitBuild } = useOnSubmitBuild({
    connectionHub,
    process,
    percent,
    onOpenChange,
  });
  const { data: branches } = useGithubLauncherVersions();
  const form = useForm<ClientBuildFormSchemaType>({
    values: { branch: "" },
    resolver: zodResolver(ClientBuildSchema),
  });

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmitBuild)}>
          <Controller
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите версию</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={process.isBuild}
                  >
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
            <Button className="w-fit" disabled={process.isBuild || !form.formState.isDirty}>
              {process.isBuild && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Собрать
            </Button>
          </div>
        </form>
      </Form>
      {process.isBuild && logs && (
        <Textarea
          value={logs.join("\n")}
          className={cn("h-64 max-h-64 font-sans", ubuntuMono.variable)}
          readOnly
        />
      )}
    </div>
  );
}
function useRef<T>(arg0: null) {
  throw new Error("Function not implemented.");
}
