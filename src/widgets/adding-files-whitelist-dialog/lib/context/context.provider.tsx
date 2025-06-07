import { createContext, useCallback, useMemo, useState } from 'react';

import { FilesListContextType } from './context.types';

import { FileListBaseEntity } from '@/shared/api/contracts';

const FilesListContextInitial: FilesListContextType = {
  directories: [],
  onChangeDirectories: () => {},
};

export const FilesListContext = createContext<FilesListContextType>(FilesListContextInitial);

export const FilesListContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [directories, setDirectories] = useState<FileListBaseEntity[]>([]);

  const onChangeDirectories = useCallback((directoriesRaw: FileListBaseEntity[]) => {
    setDirectories((prev) => (prev ? [...prev, ...directoriesRaw] : [...directoriesRaw]));
  }, []);

  const contextValue: FilesListContextType = useMemo(
    () => ({
      directories,
      onChangeDirectories,
    }),
    [directories, onChangeDirectories],
  );

  return <FilesListContext.Provider value={contextValue}>{children}</FilesListContext.Provider>;
};
