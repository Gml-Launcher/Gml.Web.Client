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
  const { directories, setDirectories, removeDirectory, clear, count: selectedFilesCount } = useFilesListStore();
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
    () => directories.map(({ directory }) => directory),
    [directories],
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
                  <div className="mt-4 p-4 bg-muted/50 rounded-md border shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium">
                        Вы выбрали <span className="font-bold text-primary">{selectedFilesCount}</span> файл(а/ов), которые будут
                        добавлены в <span className="font-medium">WhiteList</span>
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="checkout">
              <Alert variant="destructive" className="border-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Внимание!</AlertTitle>
                <AlertDescription className="mt-2">
                  Вы выбрали <span className="font-bold text-destructive-foreground">{selectedFilesCount}</span> файл(а/ов), которые будут
                  добавлены в <span className="font-medium">WhiteList</span>
                </AlertDescription>
              </Alert>

              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Список файлов:</h4>
                <ScrollArea className="h-72 rounded-md border bg-card">
                  <div className="p-4">
                    {selectedFilesList.map((directory) => (
                      <React.Fragment key={directory}>
                        <div className="p-2 rounded hover:bg-muted text-sm flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <line x1="10" y1="9" x2="8" y2="9" />
                              </svg>
                            </div>
                            <span className="font-medium">{directory}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeDirectory(directory)}
                            title="Удалить файл"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </Button>
                        </div>
                        <Separator className="my-1" />
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-x-4 mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-fit px-4" 
              onClick={onChangeTab('files')} 
              disabled={tab === 'files'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Назад
            </Button>
            {tab === 'files' && (
              <Button 
                className="w-fit px-4" 
                onClick={onChangeTab('checkout')}
                disabled={selectedFilesCount === 0}
              >
                Далее
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            )}
            {tab === 'checkout' && (
              <Button 
                className="w-fit px-4" 
                onClick={onSubmit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Добавить
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </FilesListContextProvider>
  );
}
