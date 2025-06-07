export enum AuthenticationType {
  AUTHENTICATION_TYPE_UNDEFINED = 0, // Запрещена авторизация
  AUTHENTICATION_TYPE_DATALIFE_ENGINE = 1, // Авторизация через DLE
  AUTHENTICATION_TYPE_ANY = 2, // Разрешена авторизация под любым логином и паролем
  AUTHENTICATION_TYPE_AZURIOM = 3, // Разрешена авторизация под любым логином и паролем
  AUTHENTICATION_TYPE_EASY_CABINET = 4, //  Авторизация через EasyCabinet
  AUTHENTICATION_TYPE_UNICORECMS = 5, //  Авторизация через UniCoreCMS
  AUTHENTICATION_TYPE_CUSTOM = 6, // Авторизация через свой endpoint
  AUTHENTICATION_TYPE_NAMELESS_MC = 7, // Авторизация через NamelessMC
  AUTHENTICATION_TYPE_WEB_MCR_RELOADED = 8, // Авторизация через WebMCRReloaded
  AUTHENTICATION_TYPE_WORDPRESS = 9, // Авторизация через WordPress
}

export enum AuthenticationTypeOption {
  'OPTION_0' = 'Undefined', // Запрещена авторизация
  'OPTION_1' = 'DataLife Engine', // Авторизация через DLE
  'OPTION_2' = 'Any', // Разрешена авторизация под любым логином и паролем
  'OPTION_3' = 'Azuriom', // Разрешена авторизация под любым логином и паролем
  'OPTION_4' = 'EasyCabinet', // Авторизация через EasyCabinet
  'OPTION_5' = 'UniCoreCMS', // Авторизация через UniCoreCMS
  'OPTION_6' = 'Собственная Авторизация', // Авторизация через свой endpoint
  'OPTION_7' = 'NamelessMC', // Авторизация через NamelessMC
  'OPTION_8' = 'WebMCRReloaded', // Авторизация через WebMCRReloaded
  'OPTION_9' = 'WordPress', // Авторизация через WordPress
}
