export enum AuthenticationType {
  AUTHENTICATION_TYPE_UNDEFINED = 0, // Запрещена авторизация
  AUTHENTICATION_TYPE_DATALIFE_ENGINE = 1, // Авторизация через DLE
  AUTHENTICATION_TYPE_ANY = 2, // Разрешена авторизация под любым логином и паролем
  AUTHENTICATION_TYPE_AZURIOM = 3, // Разрешена авторизация под любым логином и паролем
}

export enum AuthenticationTypeOption {
  "OPTION_0" = "Undefined", // Запрещена авторизация
  "OPTION_1" = "DataLife Engine", // Авторизация через DLE
  "OPTION_2" = "Any", // Разрешена авторизация под любым логином и паролем
  "OPTION_3" = "Azuriom", // Разрешена авторизация под любым логином и паролем
}
