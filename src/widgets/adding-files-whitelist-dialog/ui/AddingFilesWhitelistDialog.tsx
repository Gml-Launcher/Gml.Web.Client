'use client';

import React, { useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { ExclamationTriangleIcon, PlusIcon } from '@radix-ui/react-icons';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import {
  ProfileExtendedBaseEntity,
  ProfileFileBaseEntity,
  WhitelistFileBaseEntity,
} from '@/shared/api/contracts';
import { FilesTable } from '@/widgets/files-table';
import { Tabs, TabsContent } from '@/shared/ui/tabs';
import { useAddingFilesWhitelist } from '@/shared/hooks';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';

interface AddingFilesWhitelistDialogProps {
  profileName: string;
  files: ProfileFileBaseEntity[];
  profile: ProfileExtendedBaseEntity;
}

export function AddingFilesWhitelistDialog({
  profileName,
  files,
  profile,
}: AddingFilesWhitelistDialogProps) {
  const { mutate } = useAddingFilesWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [tab, setTab] = useState('files');
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onSubmit = () => {
    const files = Object.entries(rowSelection).map(([directory, _]) => ({
      profileName,
      directory,
    })) as WhitelistFileBaseEntity[];

    mutate(files);

    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit gap-2">
          <PlusIcon width={16} height={16} />
          Добавить файл
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Выбор файлов в «Белый список»</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="files" value={tab}>
          <TabsContent value="files">
            <FilesTable
              files={files}
              profile={profile}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </TabsContent>
          <TabsContent value="checkout">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Внимание!</AlertTitle>
              <AlertDescription>
                Вы выбрали <strong>{Object.keys(rowSelection).length}</strong> файл(а/ов), которые
                будут добавлены в WhiteList
              </AlertDescription>
            </Alert>

            <ScrollArea className="h-72 rounded-md border mt-4">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Список файлов:</h4>
                {Object.keys(rowSelection).map((directory) => (
                  <>
                    <div key={directory} className="text-sm">
                      {directory}
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-x-4">
          <Button className="w-fit" onClick={onChangeTab('files')} disabled={tab === 'files'}>
            Назад
          </Button>
          {tab === 'files' && (
            <Button className="w-fit" onClick={onChangeTab('checkout')}>
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
}
