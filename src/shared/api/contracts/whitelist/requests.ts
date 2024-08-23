import { WhitelistFileBaseEntity, WhitelistFolderBaseEntity } from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";

// Добавление файлов в whitelist
export type TPostWhitelistFileRequest = WhitelistFileBaseEntity[];
export type TPostWhitelistFileResponse = ResponseBaseEntity & {};

// Удаление файлов в whitelist
export type TDeleteWhitelistFileRequest = WhitelistFileBaseEntity[];
export type TDeleteWhitelistFileResponse = ResponseBaseEntity & {};

// Добавление папок в whitelist
export type TPostWhitelistFolderRequest = WhitelistFolderBaseEntity[];
export type TPostWhitelistFolderResponse = ResponseBaseEntity & {};

// Удаление папок в whitelist
export type TDeleteWhitelistFolderRequest = WhitelistFolderBaseEntity[];
export type TDeleteWhitelistFolderResponse = ResponseBaseEntity & {};
