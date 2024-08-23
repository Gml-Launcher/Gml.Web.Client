import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent } from "@/shared/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Input } from "@/shared/ui/input";
import { useAddingFolderWhitelist } from "@/shared/hooks/useWhitelist";
import { WhitelistFolderBaseEntity } from "@/shared/api/contracts";

interface AddingFoldersWhitelistDialogProps {
  profileName: string;
}

export const AddingFoldersWhitelistDialog = ({
  profileName,
}: AddingFoldersWhitelistDialogProps) => {
  const { mutate } = useAddingFolderWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [tab, setTab] = useState("folders");
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [folder, setFolder] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);

  const handleAppendFolder = (folder: string) => {
    setFolders((prev) => Array.from(new Set([...prev, folder])));
  };

  const handleChangeFolder = (folder: string) => {
    setFolder(folder);
  };

  const handleDeleteFolder = (folder: string) => {
    setFolders((prev) => prev.filter((f) => f !== folder));
  };

  const onSubmit = () => {
    // folders.map((folder) => ({ profileName: profileName, path: folder }))

    const folderPaths = folders.map((folder) => ({
      profileName,
      path: folder,
    })) as WhitelistFolderBaseEntity[];

    mutate(folderPaths);

    setFolders([]);
    setFolder("");

    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">Добавить папки</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Выбор папок в «Белый список»</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="folders" value={tab}>
          <TabsContent value="folders">
            <div className="flex gap-x-4">
              <Input
                placeholder="Введите путь до папки"
                onChange={(event) => handleChangeFolder(event.target.value)}
              ></Input>
              <Button onClick={() => handleAppendFolder(folder)}>Добавить</Button>
            </div>
            <ul className="max-h-[200px] overflow-y-scroll">
              {folders.map((folder) => (
                <li key={folder}>
                  <span>{folder}</span>
                  <Button onClick={() => handleDeleteFolder(folder)}>x</Button>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="checkout">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Внимание!</AlertTitle>
              <AlertDescription>
                Вы выбрали <strong>{folders.length}</strong> папок, которые будут добавлены в
                WhiteList
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-x-4">
          <Button className="w-fit" onClick={onChangeTab("folders")} disabled={tab === "folders"}>
            Назад
          </Button>
          {tab === "folders" && (
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
};
