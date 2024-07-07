export enum EntityState {
  ENTITY_STATE_CREATED = 0, // Профиль создан
  ENTITY_STATE_LOADING = 1, // Профиль загружается
  ENTITY_STATE_ACTIVE = 2, // Профиль активен
  ENTITY_STATE_DISABLED = 3, // Профиль отключен
}

export enum EntityStateOption {
  "OPTION_0" = "Создан", // Профиль создан
  "OPTION_1" = "Загружается", // Профиль загружается
  "OPTION_2" = "Активен", // Профиль активен
  "OPTION_3" = "Недоступен", // Профиль активен
}
