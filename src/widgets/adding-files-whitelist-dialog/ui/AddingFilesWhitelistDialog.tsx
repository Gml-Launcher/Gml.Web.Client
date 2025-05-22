'use client';

import React, { SetStateAction, useMemo, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { ExclamationTriangleIcon, PlusIcon } from '@radix-ui/react-icons';

import { FilesListContextProvider } from '../lib';

import { AddingAnyFilesForm } from './AddingAnyFilesForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { ProfileExtendedBaseEntity, ProfileFileBaseEntity } from '@/shared/api/contracts';
import { FilesTable } from '@/widgets/files-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useAddingFilesWhitelist } from '@/shared/hooks';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { useFilesListStore } from '@/widgets/adding-files-whitelist-dialog/lib/store';

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
  // const { directories, onChangeDirectories } = useFilesListContext();
  const { directories, setDirectories, clear, count: selectedFilesCount } = useFilesListStore();
  const { mutate } = useAddingFilesWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [tab, setTab] = useState('files');
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const rowSelectionConfig = {
    rowSelection,
    setRowSelection: (value: SetStateAction<RowSelectionState>) => {
      const newSelection = typeof value === 'function' ? value(rowSelection) : value;
      setRowSelection(newSelection);
      const selectedFiles = Object.entries(newSelection)
        .filter(([_, selected]) => selected)
        .map(([directory]) => ({
          profileName,
          directory,
        }));
      setDirectories(selectedFiles);
    },
  };

  const onSubmit = () => {
    mutate(directories);

    onOpenChange();
    clear();
  };

  const selectedFilesList = useMemo(
    () => [...Object.keys(rowSelection), ...directories.map(({ directory }) => directory)],
    [directories, rowSelection],
  );

  return (
    <FilesListContextProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-fit gap-2">
            <PlusIcon width={16} height={16} />
            Добавить файл
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
          <DialogHeader>
            <DialogTitle>Добавление файлов в «Белый список»</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="files" value={tab}>
            <TabsContent value="files">
              <Tabs defaultValue="file-from-list">
                <TabsList>
                  <TabsTrigger value="file-from-list">Из списка</TabsTrigger>
                  <TabsTrigger value="file-any">Добавить свой файл</TabsTrigger>
                </TabsList>
                <TabsContent value="file-from-list">
                  <FilesTable
                    files={files}
                    profile={profile}
                    rowSelection={rowSelectionConfig.rowSelection}
                    setRowSelection={rowSelectionConfig.setRowSelection}
                  />
                </TabsContent>
                <TabsContent value="file-any">
                  <AddingAnyFilesForm profile={profileName} />
                  <Separator className="my-2" />
                  Вы выбрали <strong>{selectedFilesCount}</strong> файл(а/ов), которые будут
                  добавлены в WhiteList
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="checkout">
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Внимание!</AlertTitle>
                <AlertDescription>
                  Вы выбрали <strong>{selectedFilesCount}</strong> файл(а/ов), которые будут
                  добавлены в WhiteList
                </AlertDescription>
              </Alert>

              <ScrollArea className="h-72 rounded-md border mt-4">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Список файлов:</h4>
                  {selectedFilesList.map((directory) => (
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
    </FilesListContextProvider>
  );
}
