import { create } from 'zustand';

import { FileListBaseEntity } from '@/shared/api/contracts';

interface FilesList {
  count: number;
  directories: Array<FileListBaseEntity>;
  setDirectories: (directory: FileListBaseEntity[]) => void;
  addDirectories: (directories: FileListBaseEntity[]) => void;
  addDirectory: (directory: FileListBaseEntity) => void;
  removeDirectory: (directoryPath: string) => void;
  clear: () => void;
}

export const useFilesListStore = create<FilesList>((set) => ({
  directories: [],
  count: 0,
  setDirectories: (directories: FileListBaseEntity[]) =>
    set(() => ({ directories, count: directories.length })),
  addDirectories: (directories: FileListBaseEntity[]) =>
    set(() =>
      directories ? { directories, count: directories.length } : { directories: [], count: 0 },
    ),
  addDirectory: (directory: FileListBaseEntity) =>
    set((state) => ({
      directories: [...state.directories, directory],
      count: state.directories.length + 1,
    })),
  removeDirectory: (directoryPath: string) =>
    set((state) => {
      const newDirectories = state.directories.filter(
        (dir) => dir.directory !== directoryPath
      );
      return {
        directories: newDirectories,
        count: newDirectories.length,
      };
    }),
  clear: () => set(() => ({ directories: [], count: 0 })),
}));
