"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ProfileFileBaseEntity, WhitelistFileBaseEntity } from "@/shared/api/contracts";
import { FilesTable } from "@/widgets/files-table";
import { Tabs, TabsContent } from "@/shared/ui/tabs";
import { RowSelectionState } from "@tanstack/react-table";
import { useAddingFilesWhitelist } from "@/shared/hooks/useWhitelist";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";

interface AddingFilesWhitelistDialogProps {
  profileName: string;
  files: ProfileFileBaseEntity[];
}

export function AddingFilesWhitelistDialog({
  profileName,
  files,
}: AddingFilesWhitelistDialogProps) {
  const { mutate } = useAddingFilesWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [tab, setTab] = useState("files");
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const onSubmit = () => {
    const hashFiles = Object.entries(rowSelection).map(([hash, _]) => ({
      profileName,
      hash,
    })) as WhitelistFileBaseEntity[];

    mutate(hashFiles);

    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">Добавить файлы</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Выбор файлов в «Белый список»</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="files" value={tab}>
          <TabsContent value="files">
            <FilesTable
              files={files}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </TabsContent>
          <TabsContent value="checkout">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Внимание!</AlertTitle>
              <AlertDescription>
                Вы выбрали <strong>{Object.keys(rowSelection).length}</strong> файлов, которые будут
                добавлены в WhiteList
              </AlertDescription>
            </Alert>

            <ScrollArea className="h-72 rounded-md border mt-4">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Список хешей файлов:</h4>
                {Object.keys(rowSelection).map((hash) => (
                  <>
                    <div key={hash} className="text-sm">
                      {hash}
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-x-4">
          <Button className="w-fit" onClick={onChangeTab("files")} disabled={tab === "files"}>
            Назад
          </Button>
          {tab === "files" && (
            <Button className="w-fit" onClick={onChangeTab("checkout")}>
              Далее
            </Button>
          )}
          {tab === "checkout" && (
            <Button className="w-fit" onClick={onSubmit}>
              Добавить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
