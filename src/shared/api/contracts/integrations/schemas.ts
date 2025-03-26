import { AuthenticationType } from '@/shared/enums';
import { NewsTypeEnum } from '@/shared/enums/news-type';

export type AuthIntegrationBaseEntity = {
  name: string;
  authType: AuthenticationType;
  endpoint: string | null;
};

export type NewsIntegrationBaseEntity = {
  type: NewsTypeEnum;
  url: string | null;
  name: string;
};

export type NewsEntity = {
  title: string;
  content: string;
  date: string;
  type: NewsTypeEnum;
};

export type BranchBaseEntity = {
  version: string;
};

export type LauncherBuildsBaseEntity = {
  name: string;
  dateTime: string;
};

export type LauncherActualVersionBaseEntity = Record<
  string,
  {
    version: string;
    title: string;
    description: string;
    guid: string;
  }
>;

export type SentryBaseEntity = {
  url: string;
};

export type TextureServiceBaseEntity = {
  url: string;
};

export type DiscordBaseEntity = {
  clientId: string;
  details: string;
  largeImageKey: string;
  largeImageText: string;
  smallImageKey: string;
  smallImageText: string;
};
