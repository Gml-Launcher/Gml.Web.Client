export enum NewsTypeEnum {
  Azuriom = 0,
  UnicoreCMS = 1,
  Telegram = 2,
  VK = 3,
  Discord = 4,
  Custom = 1000,
}

export enum NewsTypeOption {
  'OPTION_0' = 'Azuriom',
  'OPTION_1' = 'UnicoreCMS',
  'OPTION_2' = 'Telegram',
  'OPTION_3' = 'Вконтакте',
  'OPTION_4' = 'Discord',
  'OPTION_1000' = 'Собственная',
}

export const NewsDocumentationLinks: Record<NewsTypeEnum, string> = {
  [NewsTypeEnum.Azuriom]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-azuriom',
  [NewsTypeEnum.UnicoreCMS]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-unicore',
  [NewsTypeEnum.Telegram]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-telegram',
  [NewsTypeEnum.VK]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-vk',
  [NewsTypeEnum.Discord]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-discord',
  [NewsTypeEnum.Custom]: 'https://wiki.recloud.tech/docs/gml-launcher/backend/news/integrations-external',
};
