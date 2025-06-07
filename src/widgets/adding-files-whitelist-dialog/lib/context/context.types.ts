import { FileListBaseEntity } from '@/shared/api/contracts';

export type FilesListContextType = {
  directories: FileListBaseEntity[];
  onChangeDirectories: (directories: FileListBaseEntity[]) => void;
};
