'use client';

import { useState } from 'react';

import { FormControl, FormDescription, FormItem, FormLabel } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useFilesListStore } from '@/widgets/adding-files-whitelist-dialog/lib/store';

export function AddingAnyFilesForm({ profile }: { profile: string }) {
  const { addDirectory } = useFilesListStore();

  const [value, setValue] = useState<string | undefined>(undefined);
  const onChangeValue = (directory: string) => {
    setValue(directory);
  };

  const onAddDirectoriesCollection = () => {
    if (!value?.trim()) return;

    const directory = {
      profileName: profile,
      directory: value,
    };

    addDirectory(directory);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <FormItem className="w-full">
          <FormLabel>Наименование файла</FormLabel>
          <FormControl>
            <Input
              placeholder="Введите абсолютный путь"
              value={value || ''}
              onChange={(event) => onChangeValue(event.target.value)}
            />
          </FormControl>
          <FormDescription>
            Будет исключен файл: C:/Users/test/AppData/Roaming/
            {'{НазваниеВашегоЛаунчера}'}/clients/{value}.
          </FormDescription>
        </FormItem>

        <Button onClick={onAddDirectoriesCollection}>Добавить</Button>
      </div>
    </div>
  );
}
