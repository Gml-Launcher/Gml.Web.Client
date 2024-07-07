export enum ProfileState {
  PROFILE_STATE_CREATED = 0, // Профиль создан
  PROFILE_STATE_LOADING = 1, // Профиль загружается
  PROFILE_STATE_ACTIVE = 2, // Профиль активен
  PROFILE_STATE_DISABLED = 3, // Профиль отключен
}

export enum ProfileStateOption {
  "OPTION_0" = "Создан", // Профиль создан
  "OPTION_1" = "Загружается", // Профиль загружается
  "OPTION_2" = "Активен", // Профиль активен
  "OPTION_3" = "Недоступен", // Профиль активен
}
