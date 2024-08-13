import { WhitelistFileBaseEntity } from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";

// Добавление файлов в whitelist
export type TPostWhitelistFileRequest = WhitelistFileBaseEntity[];
export type TPostWhitelistFileResponse = ResponseBaseEntity & {};

// Удаление файлов в whitelist
export type TDeleteWhitelistFileRequest = WhitelistFileBaseEntity[];
export type TDeleteWhitelistFileResponse = ResponseBaseEntity & {};

// Добавление папок в whitelist
export type TPostWhitelistFolderRequest = WhitelistFileBaseEntity[];
export type TPostWhitelistFolderResponse = ResponseBaseEntity & {};

// Удаление папок в whitelist
export type TDeleteWhitelistFolderRequest = WhitelistFileBaseEntity[];
export type TDeleteWhitelistFolderResponse = ResponseBaseEntity & {};
