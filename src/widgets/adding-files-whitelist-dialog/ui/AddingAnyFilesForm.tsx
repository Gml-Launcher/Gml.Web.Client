'use client';

import { useState } from 'react';

import { useFilesListContext } from '../lib';

import { FormControl, FormDescription, FormItem, FormLabel } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function AddingAnyFilesForm({ profile }: { profile: string }) {
  const { onChangeDirectories } = useFilesListContext();

  const [value, setValue] = useState<string | undefined>(undefined);
  const onChangeValue = (directory: string) => {
    setValue(directory);
  };

  const onAddDirectoriesCollection = () => {
    if (!value) return;

    const directory = {
      profileName: profile,
      directory: value,
    };

    onChangeDirectories([directory]);

    setValue(undefined);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <FormItem className="w-full">
          <FormLabel>Наименование файла</FormLabel>
          <FormControl>
            <Input
              placeholder="Введите абсолютный путь"
              value={value}
              onChange={(event) => onChangeValue(event.target.value)}
            />
          </FormControl>
          <FormDescription>
            Будет исключен файл: C:/Users/test/AppData/Roaming/
            {'{НазваниеВашегоЛаунчера}'}/clients/{value}.
          </FormDescription>
        </FormItem>

        <Button onClick={onAddDirectoriesCollection}>Submit</Button>
      </div>
    </div>
  );
}
