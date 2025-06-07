import { FileListBaseEntity, FileListFolderBaseEntity } from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';

// Добавление файлов в whitelist
export type TPostWhitelistFileRequest = FileListBaseEntity[];
export type TPostWhitelistFileResponse = ResponseBaseEntity & {};

// Удаление файлов в whitelist
export type TDeleteWhitelistFileRequest = FileListBaseEntity[];
export type TDeleteWhitelistFileResponse = ResponseBaseEntity & {};

// Добавление папок в whitelist
export type TPostWhitelistFolderRequest = FileListFolderBaseEntity[];
export type TPostWhitelistFolderResponse = ResponseBaseEntity & {};

// Удаление папок в whitelist
export type TDeleteWhitelistFolderRequest = FileListFolderBaseEntity[];
export type TDeleteWhitelistFolderResponse = ResponseBaseEntity & {};
