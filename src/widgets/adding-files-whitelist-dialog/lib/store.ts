import { create } from 'zustand';

import { FileListBaseEntity } from '@/shared/api/contracts';

interface FilesList {
  count: number;
  directories: Array<FileListBaseEntity>;
  setDirectories: (directory: FileListBaseEntity[]) => void;
  addDirectories: (directories: FileListBaseEntity[]) => void;
  addDirectory: (directory: FileListBaseEntity) => void;
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
  clear: () => set(() => ({ directories: [], count: 0 })),
}));
