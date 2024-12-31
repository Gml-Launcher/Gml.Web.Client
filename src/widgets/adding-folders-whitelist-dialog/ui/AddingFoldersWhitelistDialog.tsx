import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { InfoIcon, Trash2Icon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent } from '@/shared/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Input } from '@/shared/ui/input';
import { useAddingFolderWhitelist } from '@/shared/hooks';
import { WhitelistFolderBaseEntity } from '@/shared/api/contracts';
import { Card } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';

interface AddingFoldersWhitelistDialogProps {
  profileName: string;
}

export const AddingFoldersWhitelistDialog = ({
  profileName,
}: AddingFoldersWhitelistDialogProps) => {
  const { mutate } = useAddingFolderWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [preview, setPreview] = useState(false);

  const [tab, setTab] = useState('folders');
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [folder, setFolder] = useState<string>('');
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
    setFolder('');

    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">Добавить папки</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Добавление папок в «Белый список»</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="folders" value={tab}>
          <TabsContent value="folders" className="grid gap-y-2">
            <div className="flex gap-x-4">
              <Input
                placeholder="Введите путь до папки"
                onChange={(event) => handleChangeFolder(event.target.value)}
              />
              <Button onClick={() => handleAppendFolder(folder)} disabled={folder == ''}>
                Добавить
              </Button>
            </div>
            {preview && (
              <Card className="rounded-md">
                <div className="max-w-[1050px] py-2 px-2">
                  <span className="break-words">
                    C:/Users/test/AppData/Roaming/{'{НазваниеВашегоЛаунчера}'}/clients/{profileName}
                    /{folder}
                  </span>
                </div>
              </Card>
            )}
            <Card className="rounded-md">
              <ul className="max-h-[200px] overflow-y-scroll">
                {folders.map((folder) => (
                  <li key={folder} className="flex gap-x-2 py-2 px-2 items-center">
                    <span>{folder}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="py-2 px-2"
                      onClick={() => handleDeleteFolder(folder)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </li>
                ))}
                {folders.length == 0 && (
                  <li className="flex gap-x-2 py-2 px-2 justify-center">
                    <span>Данный список пуст</span>
                  </li>
                )}
              </ul>
            </Card>
            <Alert variant="warning">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Обратите внимание!</AlertTitle>
              <AlertDescription className="mb-2">
                Пример заполнения: <b>{'jorneymap/maps'}</b> будет заменено на{' '}
                <div>
                  <span>
                    C:/Users/test/AppData/Roaming/<b>{'{НазваниеВашегоЛаунчера}'}</b>/clients/
                    {profileName}/<b>{'jorneymap/maps'}</b>
                  </span>
                </div>
              </AlertDescription>
            </Alert>
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
          <div className="flex items-center space-x-2">
            <Switch id="preview-mode" checked={preview} onCheckedChange={setPreview} />
            <Label htmlFor="preview-mode">Preview</Label>
          </div>
          <Button className="w-fit" onClick={onChangeTab('folders')} disabled={tab === 'folders'}>
            Назад
          </Button>
          {tab === 'folders' && (
            <Button
              className="w-fit"
              onClick={onChangeTab('checkout')}
              disabled={folders.length == 0}
            >
              Далее
            </Button>
          )}
          {tab === 'checkout' && (
            <Button className="w-fit" onClick={onSubmit}>
              Добавить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
